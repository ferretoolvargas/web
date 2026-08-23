import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, delay, map, Observable, of, tap } from 'rxjs';
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
    return combineLatest([
      this.collection<Product>(this.productsKey, 'products.json'),
      this.collection<Offer>(this.offersKey, 'offers.json'),
    ]).pipe(map(([items, offers]) => this.paginate(items, query, offers)));
  }
  product(slug: string): Observable<Product | undefined> {
    if (!this.config.useMocks)
      return this.http
        .get<ApiResponse<Product>>(`${this.config.apiUrl}/products/${encodeURIComponent(slug)}`)
        .pipe(map((response) => response.data));
    return combineLatest([
      this.collection<Product>(this.productsKey, 'products.json'),
      this.collection<Offer>(this.offersKey, 'offers.json'),
    ]).pipe(
      map(([items, offers]) => {
        const product = items.find((item) => item.slug === slug);
        return product ? this.decorate(product, offers) : undefined;
      }),
    );
  }
  relatedProducts(product: Product, limit = 4): Observable<Product[]> {
    return this.products({
      page: 1,
      limit: limit + 1,
      filters: { categoryId: product.categoryId, publicVisible: true },
    }).pipe(
      map((response) => response.data.filter((item) => item.id !== product.id).slice(0, limit)),
    );
  }
  productById(id: string): Observable<Product | undefined> {
    if (!this.config.useMocks)
      return this.http
        .get<ApiResponse<Product>>(`${this.config.apiUrl}/admin/products/${encodeURIComponent(id)}`)
        .pipe(map((response) => response.data));
    return this.collection<Product>(this.productsKey, 'products.json').pipe(
      map((items) => items.find((item) => item.id === id)),
    );
  }
  slugAvailable(slug: string, excludeId?: string): Observable<boolean> {
    if (!this.config.useMocks)
      return this.http
        .get<ApiResponse<boolean>>(`${this.config.apiUrl}/admin/products/slug-available`, {
          params: { slug, excludeId: excludeId ?? '' },
        })
        .pipe(map((response) => response.data));
    return this.collection<Product>(this.productsKey, 'products.json').pipe(
      map((items) => !items.some((item) => item.slug === slug && item.id !== excludeId)),
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
        if (index >= 0) items[index] = product;
        else items.unshift(product);
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
  private decorate(product: Product, offers: Offer[]): Product {
    const effectivePrice = this.finalPrice(product, offers);
    return {
      ...product,
      effectivePrice,
      discountPercent:
        effectivePrice < product.price ? Math.round((1 - effectivePrice / product.price) * 100) : 0,
    };
  }
  reset(): void {
    this.storage.remove(this.productsKey);
    this.storage.remove(this.offersKey);
  }
  private collection<T>(key: string, file: string): Observable<T[]> {
    const stored = this.storage.get<T[]>(key);
    const collection$ = stored
      ? of(stored)
      : this.http
          .get<T[]>(`${this.config.mockUrl}/${file}`)
          .pipe(tap((items) => this.storage.set(key, items)));
    return this.config.mockLatencyMs
      ? collection$.pipe(delay(this.config.mockLatencyMs))
      : collection$;
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
  private paginate(
    items: Product[],
    query: QueryParams,
    offers: Offer[] = [],
  ): PaginatedResponse<Product> {
    const now = Date.now();
    const activeOffers = offers.filter(
      (offer) =>
        offer.active && Date.parse(offer.startsAt) <= now && Date.parse(offer.endsAt) >= now,
    );
    items = items.map((item) => this.decorate(item, activeOffers));
    const search = query.search?.trim().toLocaleLowerCase('es') ?? '';
    let filtered = items.filter(
      (item) =>
        !search ||
        [item.name, item.sku, item.barcode, item.model, ...item.keywords].some((value) =>
          value?.toLocaleLowerCase('es').includes(search),
        ),
    );
    for (const [key, value] of Object.entries(query.filters ?? {})) {
      if (value === undefined || value === '') continue;
      if (key === 'minPrice')
        filtered = filtered.filter((item) => (item.effectivePrice ?? item.price) >= Number(value));
      else if (key === 'maxPrice')
        filtered = filtered.filter((item) => (item.effectivePrice ?? item.price) <= Number(value));
      else if (key === 'offer')
        filtered = filtered.filter((item) => (item.discountPercent ?? 0) > 0);
      else
        filtered = filtered.filter((item) => String(item[key as keyof Product]) === String(value));
    }
    const sortBy = query.sortBy as keyof Product | undefined;
    if (sortBy)
      filtered.sort((a, b) => {
        const left = sortBy === 'price' ? (a.effectivePrice ?? a.price) : a[sortBy];
        const right = sortBy === 'price' ? (b.effectivePrice ?? b.price) : b[sortBy];
        const comparison =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left ?? '').localeCompare(String(right ?? ''), 'es');
        return comparison * (query.sortOrder === 'desc' ? -1 : 1);
      });
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
