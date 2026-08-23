import { Injectable } from '@angular/core';
import { Product, ProductVariant } from '../models/domain.models';
import { COMMERCIAL_STATUS } from '../config/brand.config';

@Injectable({ providedIn: 'root' })
export class ProductSharingService {
  readonly phone = '59160514138';

  share(product: Product, quality: string, canonicalUrl: string, price: number): string {
    const commercial = COMMERCIAL_STATUS.pricesConfirmed ? ` · Bs ${price.toFixed(2)}` : '';
    const message = `${product.name} · Línea ${quality}${commercial} · ${this.stock(product)}. ${canonicalUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  consult(
    product: Product,
    variant: ProductVariant | undefined,
    canonicalUrl: string,
    price: number,
  ): string {
    const presentation = variant
      ? `, variante ${Object.values(variant.attributes).join(' / ')} (SKU ${variant.sku})`
      : ` (SKU ${product.sku})`;
    const priceText = COMMERCIAL_STATUS.pricesConfirmed
      ? `, precio publicado Bs ${price.toFixed(2)}`
      : ', precio y disponibilidad';
    const message = `Hola, Ferretool Vargas. Quisiera recibir información sobre ${product.name}${presentation}${priceText}. ${canonicalUrl}`;
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(message)}`;
  }

  stock(product: Product): string {
    if (!COMMERCIAL_STATUS.inventoryConfirmed) return 'Consultar disponibilidad';
    return {
      disponible: 'Disponible',
      'pocas-unidades': 'Pocas unidades',
      agotado: 'Agotado',
      consultar: 'Consultar disponibilidad',
    }[product.stockStatus];
  }
}
