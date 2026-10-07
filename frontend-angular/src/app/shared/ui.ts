import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models/domain.models';
import { COMMERCIAL_STATUS } from '../core/config/brand.config';

export type IconName =
  | 'search'
  | 'menu'
  | 'close'
  | 'sun'
  | 'moon'
  | 'cart'
  | 'heart'
  | 'user'
  | 'truck'
  | 'shield'
  | 'support'
  | 'tool'
  | 'bolt'
  | 'manual'
  | 'box'
  | 'arrow'
  | 'home'
  | 'grid'
  | 'tag'
  | 'message'
  | 'more';

@Component({
  selector: 'app-icon',
  template: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    @switch (name()) {
      @case ('search') {
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      }
      @case ('menu') {
        <path d="M4 7h16M4 12h16M4 17h16" />
      }
      @case ('close') {
        <path d="m6 6 12 12M18 6 6 18" />
      }
      @case ('sun') {
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        />
      }
      @case ('moon') {
        <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
      }
      @case ('cart') {
        <path d="M3 4h2l2 11h10l3-8H6M9 20h.01M17 20h.01" />
      }
      @case ('heart') {
        <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
        />
      }
      @case ('user') {
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      }
      @case ('truck') {
        <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      }
      @case ('shield') {
        <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-3Z" />
        <path d="m9 12 2 2 4-5" />
      }
      @case ('support') {
        <path
          d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5ZM17 20c0 1-2 2-4 2"
        />
      }
      @case ('bolt') {
        <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />
      }
      @case ('manual') {
        <path d="m4 18 6-6M7 21l6-6M14 4l6 6M16 2l6 6M3 7l4-4 14 14-4 4L3 7Z" />
      }
      @case ('box') {
        <path d="m4 7 8-4 8 4-8 4-8-4ZM4 7v10l8 4 8-4V7M12 11v10" />
      }
      @case ('arrow') {
        <path d="M5 12h14M14 7l5 5-5 5" />
      }
      @case ('home') {
        <path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" />
      }
      @case ('grid') {
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      }
      @case ('tag') {
        <path d="M20 13 13 20l-9-9V4h7l9 9Z" />
        <circle cx="8.5" cy="8.5" r="1" />
      }
      @case ('message') {
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-5A8 8 0 1 1 21 15Z" />
      }
      @case ('more') {
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      }
      @default {
        <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-3 3-3-3 3-3Z" />
      }
    }
  </svg>`,
})
export class Icon {
  name = input<IconName>('tool');
}

@Component({
  selector: 'app-empty',
  template: '<div class="state"><strong>{{title()}}</strong><p>{{message()}}</p></div>',
})
export class EmptyState {
  title = input('Sin resultados');
  message = input('Prueba modificando los filtros.');
}
@Component({
  selector: 'app-spinner',
  template: '<div class="spinner" role="status"><span class="sr-only">Cargando</span></div>',
})
export class Spinner {}
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, Icon],
  template: `<article class="product-card">
    @if (primaryImage) {
      <img
        class="product-image"
        [src]="primaryImage.url"
        [alt]="primaryImage.alt"
        width="360"
        height="240"
      />
    } @else {
      <div class="product-image fallback" role="img" [attr.aria-label]="placeholderLabel">
        <app-icon name="tool" /><small>IMAGEN PRODUCTO</small>
      </div>
    }
    <div class="stack">
      <div class="badges">
        <span>{{ qualityLabel }}</span>
        @if (commercial.campaignsConfirmed && product().discountPercent) {
          <span>Oferta -{{ product().discountPercent }}%</span>
        }
        @if (product().isNew) {
          <span>Nuevo</span>
        }
        @if (product().featured) {
          <span>Destacado</span>
        }
      </div>
      <h3>
        <a [routerLink]="['/productos', product().slug]">{{ product().name }}</a>
      </h3>
      <p>{{ product().summary }}</p>
      @if (
        commercial.pricesConfirmed &&
        product().effectivePrice &&
        product().effectivePrice! < product().price
      ) {
        <del>{{ product().price | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO' }}</del>
      }
      @if (commercial.pricesConfirmed) {
        <strong class="price">{{
          product().effectivePrice ?? product().price
            | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO'
        }}</strong>
      } @else {
        <strong class="price pending">Precio por consultar</strong>
      }
      <small>{{ stockLabel }}</small>
      <a class="button product-action" [routerLink]="['/productos', product().slug]">
        Ver producto <app-icon name="arrow" />
      </a>
    </div>
  </article>`,
})
export class ProductCard {
  product = input.required<Product>();
  readonly commercial = COMMERCIAL_STATUS;
  get primaryImage() {
    return [...this.product().images].sort(
      (a, b) => Number(b.primary) - Number(a.primary) || a.order - b.order,
    )[0];
  }
  get placeholderLabel() {
    return `Imagen no disponible para ${this.product().name}`;
  }
  get qualityLabel() {
    return { ECONOMICO: 'Esencial', ESTANDAR: 'Rendimiento', PROFESIONAL: 'Profesional' }[
      this.product().quality
    ];
  }
  get stockLabel() {
    if (!this.commercial.inventoryConfirmed) return 'Consultar disponibilidad';
    return {
      disponible: 'Disponible',
      'pocas-unidades': 'Pocas unidades',
      agotado: 'Agotado',
      consultar: 'Consultar',
    }[this.product().stockStatus];
  }
}
