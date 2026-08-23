import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import {
  AdminCatalogItem,
  AdminCatalogRepository,
  CatalogKind,
} from '../models/admin-catalog.models';
import { PaginatedResponse, QueryParams, ValidationError } from '../models/domain.models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AdminCatalogService implements AdminCatalogRepository {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private config = inject(APP_CONFIG);
  private readonly key = 'fv-admin-catalogs';

  list(kind: CatalogKind, query: QueryParams): Observable<PaginatedResponse<AdminCatalogItem>> {
    return this.load().pipe(
      map((items) => {
        const search = query.search?.trim().toLocaleLowerCase('es') ?? '';
        let filtered = items.filter(
          (item) =>
            item.kind === kind &&
            (!search ||
              item.name.toLocaleLowerCase('es').includes(search) ||
              item.description.toLocaleLowerCase('es').includes(search)),
        );
        const active = query.filters?.['active'];
        if (active !== undefined && active !== '')
          filtered = filtered.filter(
            (item) => item.active === (active === true || active === 'true'),
          );
        const direction = query.sortOrder === 'desc' ? -1 : 1;
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'es') * direction);
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / query.limit));
        const page = Math.min(Math.max(query.page, 1), totalPages);
        const start = (page - 1) * query.limit;
        return {
          data: filtered.slice(start, start + query.limit),
          meta: { page, limit: query.limit, total, totalPages },
        };
      }),
    );
  }

  all(kind: CatalogKind): Observable<AdminCatalogItem[]> {
    return this.load().pipe(map((items) => items.filter((item) => item.kind === kind)));
  }

  save(item: AdminCatalogItem): Observable<AdminCatalogItem> {
    return this.load().pipe(
      switchMap((items) => {
        const duplicate = items.some(
          (current) =>
            current.kind === item.kind &&
            current.id !== item.id &&
            (current.name.toLocaleLowerCase('es') === item.name.toLocaleLowerCase('es') ||
              current.slug === item.slug),
        );
        if (duplicate)
          return throwError(() => this.validation('Ya existe un nombre o slug igual.'));
        if (item.kind === 'categories' && this.createsCycle(item, items))
          return throwError(() => this.validation('La jerarquía de categorías crearía un ciclo.'));
        const index = items.findIndex((current) => current.id === item.id);
        if (index >= 0) items[index] = item;
        else items.push(item);
        this.storage.set(this.key, items);
        return of(item).pipe(delay(this.config.mockLatencyMs));
      }),
    );
  }

  toggle(id: string): Observable<AdminCatalogItem> {
    return this.load().pipe(
      switchMap((items) => {
        const item = items.find((current) => current.id === id);
        if (!item) return throwError(() => new Error('Registro no encontrado.'));
        item.active = !item.active;
        this.storage.set(this.key, items);
        return of(item).pipe(delay(this.config.mockLatencyMs));
      }),
    );
  }

  reset(): void {
    this.storage.remove(this.key);
  }

  private load(): Observable<AdminCatalogItem[]> {
    const stored = this.storage.get<AdminCatalogItem[]>(this.key);
    if (stored) return of(stored).pipe(delay(this.config.mockLatencyMs));
    return this.http.get<AdminCatalogItem[]>(`${this.config.mockUrl}/catalogs.json`).pipe(
      tap((items) => this.storage.set(this.key, items)),
      delay(this.config.mockLatencyMs),
    );
  }

  private createsCycle(item: AdminCatalogItem, items: AdminCatalogItem[]): boolean {
    if (!item.parentId) return false;
    if (item.parentId === item.id) return true;
    let parentId: string | undefined = item.parentId;
    const visited = new Set([item.id]);
    while (parentId) {
      if (visited.has(parentId)) return true;
      visited.add(parentId);
      parentId = items.find((current) => current.id === parentId)?.parentId;
    }
    return false;
  }

  private validation(message: string): ValidationError {
    return { statusCode: 422, message, errors: { name: [message] } };
  }
}
