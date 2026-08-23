import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { CampaignRepository } from '../models/campaign-repository';
import {
  Offer,
  PaginatedResponse,
  Promotion,
  QueryParams,
  ValidationError,
} from '../models/domain.models';
import { StorageService } from './storage.service';

type Campaign = Offer | Promotion;

@Injectable({ providedIn: 'root' })
export class CampaignService implements CampaignRepository {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private config = inject(APP_CONFIG);
  private offersKey = 'fv-offers';
  private promotionsKey = 'fv-promotions';
  listOffers(query: QueryParams): Observable<PaginatedResponse<Offer>> {
    if (!this.config.useMocks)
      return this.http.get<PaginatedResponse<Offer>>(`${this.config.apiUrl}/offers`);
    return this.load<Offer>(this.offersKey, 'offers.json').pipe(
      map((items) => this.paginate(items, query)),
    );
  }
  listPromotions(query: QueryParams): Observable<PaginatedResponse<Promotion>> {
    if (!this.config.useMocks)
      return this.http.get<PaginatedResponse<Promotion>>(`${this.config.apiUrl}/promotions`);
    return this.load<Promotion>(this.promotionsKey, 'promotions.json').pipe(
      map((items) => this.paginate(items, query)),
    );
  }
  activePromotions(): Observable<Promotion[]> {
    return this.load<Promotion>(this.promotionsKey, 'promotions.json').pipe(
      map((items) => items.filter((item) => this.isCurrent(item))),
    );
  }
  saveOffer(offer: Offer): Observable<Offer> {
    if (
      offer.normalPrice <= 0 ||
      offer.promotionalPrice <= 0 ||
      offer.promotionalPrice >= offer.normalPrice
    )
      return throwError(() =>
        this.validation('El precio promocional debe ser positivo y menor al precio normal.'),
      );
    return this.save(this.offersKey, 'offers.json', offer);
  }
  savePromotion(promotion: Promotion): Observable<Promotion> {
    if (promotion.active && (!promotion.conditions.trim() || !promotion.type))
      return throwError(() =>
        this.validation('Una promoción activa necesita tipo y condiciones visibles.'),
      );
    return this.save(this.promotionsKey, 'promotions.json', promotion);
  }
  toggleOffer(id: string): Observable<Offer> {
    return this.toggle<Offer>(this.offersKey, 'offers.json', id);
  }
  togglePromotion(id: string): Observable<Promotion> {
    return this.toggle<Promotion>(this.promotionsKey, 'promotions.json', id);
  }
  isCurrent(campaign: Campaign, now = Date.now()): boolean {
    return (
      campaign.active && Date.parse(campaign.startsAt) <= now && Date.parse(campaign.endsAt) >= now
    );
  }
  discount(offer: Offer): number {
    return offer.normalPrice > 0
      ? Math.round((1 - offer.promotionalPrice / offer.normalPrice) * 100)
      : 0;
  }
  private save<T extends Campaign>(key: string, file: string, item: T): Observable<T> {
    if (Date.parse(item.startsAt) >= Date.parse(item.endsAt))
      return throwError(() =>
        this.validation('La fecha final debe ser posterior a la fecha inicial.'),
      );
    return this.load<T>(key, file).pipe(
      switchMap((items) => {
        const duplicate = items.some(
          (current) =>
            current.id !== item.id &&
            (current.slug === item.slug || current.name.toLowerCase() === item.name.toLowerCase()),
        );
        if (duplicate)
          return throwError(() =>
            this.validation('Ya existe una campaña con el mismo nombre o slug.'),
          );
        const index = items.findIndex((current) => current.id === item.id);
        if (index >= 0) items[index] = item;
        else items.unshift(item);
        this.storage.set(key, items);
        return of(item).pipe(delay(this.config.mockLatencyMs));
      }),
    );
  }
  private toggle<T extends Campaign>(key: string, file: string, id: string): Observable<T> {
    return this.load<T>(key, file).pipe(
      switchMap((items) => {
        const item = items.find((current) => current.id === id);
        if (!item) return throwError(() => new Error('Campaña no encontrada.'));
        item.active = !item.active;
        this.storage.set(key, items);
        return of(item).pipe(delay(this.config.mockLatencyMs));
      }),
    );
  }
  private load<T>(key: string, file: string): Observable<T[]> {
    const stored = this.storage.get<T[]>(key);
    const campaigns$ = stored
      ? of(stored)
      : this.http
          .get<T[]>(`${this.config.mockUrl}/${file}`)
          .pipe(tap((items) => this.storage.set(key, items)));
    return this.config.mockLatencyMs
      ? campaigns$.pipe(delay(this.config.mockLatencyMs))
      : campaigns$;
  }
  private paginate<T extends Campaign>(items: T[], query: QueryParams): PaginatedResponse<T> {
    const search = query.search?.toLowerCase().trim() ?? '';
    let filtered = items.filter((item) => !search || item.name.toLowerCase().includes(search));
    const active = query.filters?.['active'];
    if (active !== undefined && active !== '')
      filtered = filtered.filter((item) => item.active === (active === true || active === 'true'));
    const validity = query.filters?.['validity'];
    if (validity === 'current') filtered = filtered.filter((item) => this.isCurrent(item));
    if (validity === 'expired')
      filtered = filtered.filter((item) => Date.parse(item.endsAt) < Date.now());
    filtered.sort((a, b) => b.priority - a.priority);
    const total = filtered.length,
      totalPages = Math.max(1, Math.ceil(total / query.limit)),
      page = Math.min(Math.max(1, query.page), totalPages),
      start = (page - 1) * query.limit;
    return {
      data: filtered.slice(start, start + query.limit),
      meta: { page, limit: query.limit, total, totalPages },
    };
  }
  private validation(message: string): ValidationError {
    return { statusCode: 422, message, errors: { campaign: [message] } };
  }
}
