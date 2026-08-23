import { Injectable } from '@angular/core';
import { Product, ProductVariant } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class ProductSharingService {
  readonly phone = '59160514138';

  share(product: Product, quality: string, canonicalUrl: string, price: number): string {
    const message = `${product.name} · Línea ${quality} · Bs ${price.toFixed(2)} · ${this.stock(product)}. ${canonicalUrl}`;
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
    const message = `Hola, Ferretool Vargas. Quisiera recibir información sobre ${product.name}${presentation}, precio publicado Bs ${price.toFixed(2)}. ${canonicalUrl}`;
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(message)}`;
  }

  stock(product: Product): string {
    return {
      disponible: 'Disponible',
      'pocas-unidades': 'Pocas unidades',
      agotado: 'Agotado',
      consultar: 'Consultar disponibilidad',
    }[product.stockStatus];
  }
}
