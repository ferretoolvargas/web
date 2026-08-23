export type SortOrder = 'asc' | 'desc';
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
export interface QueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, string | number | boolean | undefined>;
}
export interface ValidationError {
  statusCode: number;
  message: string;
  errors: Record<string, string[]>;
}
export type QualityLevel = 'ECONOMICO' | 'ESTANDAR' | 'PROFESIONAL';
export type StockStatus = 'disponible' | 'pocas-unidades' | 'agotado' | 'consultar';
export interface Entity {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}
export interface Category extends Entity {
  description: string;
  parentId?: string;
}
export interface Subcategory extends Entity {
  categoryId: string;
  description: string;
}
export interface Brand extends Entity {
  description: string;
  logoUrl?: string;
  website?: string;
}
export interface Unit extends Entity {
  abbreviation: string;
}
export interface Quality extends Entity {
  code: QualityLevel;
  description: string;
}
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  primary: boolean;
}
export interface ProductVariant {
  id: string;
  sku: string;
  code?: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
}
export interface Specification {
  label: string;
  value: string;
  unit?: string;
}
export interface Product extends Entity {
  sku: string;
  barcode?: string;
  model?: string;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  quality: QualityLevel;
  summary: string;
  description: string;
  uses: string;
  packageContents: string;
  cost: number;
  price: number;
  wholesalePrice?: number;
  unitId: string;
  publicVisible: boolean;
  featured: boolean;
  isNew: boolean;
  stock: number;
  minimumStock: number;
  stockStatus: StockStatus;
  warranty?: string;
  origin?: string;
  care?: string;
  images: ProductImage[];
  specifications: Specification[];
  variants: ProductVariant[];
  createdAt: string;
  keywords: string[];
  /** Campos de presentación calculados por el repositorio, no persistidos. */
  effectivePrice?: number;
  discountPercent?: number;
}
export interface Offer extends Entity {
  productIds: string[];
  promotionalPrice: number;
  startsAt: string;
  endsAt: string;
  priority: number;
  limit?: number;
}
export type PromotionType = 'combo' | 'categoria' | 'marca' | 'cantidad' | 'regalo' | 'otro';
export interface Promotion extends Entity {
  description: string;
  bannerUrl?: string;
  type: PromotionType;
  conditions: string;
  startsAt: string;
  endsAt: string;
  productIds: string[];
  categoryIds: string[];
  brandIds: string[];
  priority: number;
}
export type Role = 'ADMINISTRADOR' | 'VENDEDOR' | 'ALMACEN';
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: string;
}
export interface DashboardData {
  salesToday: number;
  activeProducts: number;
  lowStock: number;
  activeOffers: number;
  recentMovements: DashboardMovement[];
  popularProducts: DashboardPopularProduct[];
}
export interface DashboardMovement {
  id: string;
  description: string;
  type: 'producto' | 'precio' | 'oferta' | 'inventario';
  occurredAt: string;
}
export interface DashboardPopularProduct {
  productId: string;
  name: string;
  consultations: number;
}
