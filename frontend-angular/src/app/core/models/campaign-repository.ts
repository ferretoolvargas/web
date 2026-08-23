import { Observable } from 'rxjs';
import { Offer, PaginatedResponse, Promotion, QueryParams } from './domain.models';

export abstract class CampaignRepository {
  abstract listOffers(query: QueryParams): Observable<PaginatedResponse<Offer>>;
  abstract listPromotions(query: QueryParams): Observable<PaginatedResponse<Promotion>>;
  abstract saveOffer(offer: Offer): Observable<Offer>;
  abstract savePromotion(promotion: Promotion): Observable<Promotion>;
  abstract toggleOffer(id: string): Observable<Offer>;
  abstract togglePromotion(id: string): Observable<Promotion>;
}
