import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models/domain.models';
import { COMMERCIAL_STATUS } from '../core/config/brand.config';

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
  imports: [CurrencyPipe, RouterLink],
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
        <span aria-hidden="true">▧</span><small>Imagen no disponible</small>
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
