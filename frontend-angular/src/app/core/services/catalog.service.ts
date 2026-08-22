import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import {
  ApiResponse,
  Offer,
  PaginatedResponse,
  Product,
  QueryParams,
} from '../models/domain.models';
import { ProductRepository } from '../models/repository.models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CatalogService implements ProductRepository {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private config = inject(APP_CONFIG);
  private readonly productsKey = 'fv-products';
  private readonly offersKey = 'fv-offers';
  products(query: QueryParams): Observable<PaginatedResponse<Product>> {
    if (!this.config.useMocks)
      return this.http.get<PaginatedResponse<Product>>(`${this.config.apiUrl}/products`, {
        params: this.httpParams(query),
      });
    return this.collection<Product>(this.productsKey, 'products.json').pipe(
      map((items) => this.paginate(items, query)),
    );
  }
  product(slug: string): Observable<Product | undefined> {
    if (!this.config.useMocks)
      return this.http
        .get<ApiResponse<Product>>(`${this.config.apiUrl}/products/${encodeURIComponent(slug)}`)
        .pipe(map((response) => response.data));
    return this.collection<Product>(this.productsKey, 'products.json').pipe(
      map((items) => items.find((item) => item.slug === slug)),
    );
  }
  save(product: Product): Observable<Product> {
    if (!this.config.useMocks) {
      const request = product.id
        ? this.http.put<ApiResponse<Product>>(
            `${this.config.apiUrl}/products/${product.id}`,
            product,
          )
        : this.http.post<ApiResponse<Product>>(`${this.config.apiUrl}/products`, product);
      return request.pipe(map((response) => response.data));
    }
    return this.collection<Product>(this.productsKey, 'products.json').pipe(
      map((items) => {
        const index = items.findIndex((item) => item.id === product.id);
        index >= 0 ? (items[index] = product) : items.unshift(product);
        this.storage.set(this.productsKey, items);
        return product;
      }),
    );
  }
  offers(): Observable<Offer[]> {
    if (!this.config.useMocks)
      return this.http
        .get<ApiResponse<Offer[]>>(`${this.config.apiUrl}/offers`)
        .pipe(map((response) => response.data));
    return this.collection<Offer>(this.offersKey, 'offers.json');
  }
  finalPrice(product: Product, offers: Offer[]): number {
    const now = Date.now();
    const offer = offers
      .filter(
        (item) =>
          item.active &&
          item.productIds.includes(product.id) &&
          Date.parse(item.startsAt) <= now &&
          Date.parse(item.endsAt) >= now,
      )
      .sort((a, b) => b.priority - a.priority)[0];
    return offer?.promotionalPrice ?? product.price;
  }
  reset(): void {
    this.storage.remove(this.productsKey);
    this.storage.remove(this.offersKey);
  }
  private collection<T>(key: string, file: string): Observable<T[]> {
    const stored = this.storage.get<T[]>(key);
    if (stored) return of(stored).pipe(delay(this.config.mockLatencyMs));
    return this.http.get<T[]>(`${this.config.mockUrl}/${file}`).pipe(
      tap((items) => this.storage.set(key, items)),
      delay(this.config.mockLatencyMs),
    );
  }
  private httpParams(query: QueryParams): HttpParams {
    let params = new HttpParams().set('page', query.page).set('limit', query.limit);
    if (query.search) params = params.set('search', query.search);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);
    for (const [key, value] of Object.entries(query.filters ?? {}))
      if (value !== undefined && value !== '') params = params.set(key, value);
    return params;
  }
  private paginate(items: Product[], query: QueryParams): PaginatedResponse<Product> {
    const search = query.search?.trim().toLocaleLowerCase('es') ?? '';
    let filtered = items.filter(
      (item) =>
        !search ||
        [item.name, item.sku, item.barcode, item.model, ...item.keywords].some((value) =>
          value?.toLocaleLowerCase('es').includes(search),
        ),
    );
    for (const [key, value] of Object.entries(query.filters ?? {}))
      if (value !== undefined && value !== '')
        filtered = filtered.filter((item) => String(item[key as keyof Product]) === String(value));
    const sortBy = query.sortBy as keyof Product | undefined;
    if (sortBy)
      filtered.sort(
        (a, b) =>
          String(a[sortBy] ?? '').localeCompare(String(b[sortBy] ?? ''), 'es') *
          (query.sortOrder === 'desc' ? -1 : 1),
      );
    const total = filtered.length,
      totalPages = Math.max(1, Math.ceil(total / query.limit)),
      page = Math.min(Math.max(1, query.page), totalPages),
      start = (page - 1) * query.limit;
    return {
      data: filtered.slice(start, start + query.limit),
      meta: { page, limit: query.limit, total, totalPages },
    };
  }
}
