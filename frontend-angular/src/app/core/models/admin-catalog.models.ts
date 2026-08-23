import { Observable } from 'rxjs';
import { PaginatedResponse, QueryParams, QualityLevel } from './domain.models';

export type CatalogKind = 'categories' | 'subcategories' | 'brands' | 'units' | 'qualities';

export interface AdminCatalogItem {
  id: string;
  kind: CatalogKind;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  parentId?: string;
  categoryId?: string;
  abbreviation?: string;
  qualityCode?: QualityLevel;
  logoUrl?: string;
  website?: string;
}

export abstract class AdminCatalogRepository {
  abstract list(
    kind: CatalogKind,
    query: QueryParams,
  ): Observable<PaginatedResponse<AdminCatalogItem>>;
  abstract all(kind: CatalogKind): Observable<AdminCatalogItem[]>;
  abstract save(item: AdminCatalogItem): Observable<AdminCatalogItem>;
  abstract toggle(id: string): Observable<AdminCatalogItem>;
}
