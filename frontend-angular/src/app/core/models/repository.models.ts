import { Observable } from 'rxjs';
import { Offer, PaginatedResponse, Product, QueryParams } from './domain.models';

/** Contrato que debe respetar tanto la fuente mock como la futura API NestJS. */
export interface ProductRepository {
  products(query: QueryParams): Observable<PaginatedResponse<Product>>;
  product(slug: string): Observable<Product | undefined>;
  relatedProducts(product: Product, limit?: number): Observable<Product[]>;
  productById(id: string): Observable<Product | undefined>;
  slugAvailable(slug: string, excludeId?: string): Observable<boolean>;
  save(product: Product): Observable<Product>;
  offers(): Observable<Offer[]>;
}
