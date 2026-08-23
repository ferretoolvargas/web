import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models/domain.models';

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
    <div class="product-image" aria-hidden="true">🔧</div>
    <div class="stack">
      <div class="badges">
        <span>{{ qualityLabel }}</span>
        @if (product().discountPercent) {
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
      @if (product().effectivePrice && product().effectivePrice! < product().price) {
        <del>{{ product().price | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO' }}</del>
      }
      <strong class="price">{{
        product().effectivePrice ?? product().price
          | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO'
      }}</strong
      ><small>{{ stockLabel }}</small>
    </div>
  </article>`,
})
export class ProductCard {
  product = input.required<Product>();
  get qualityLabel() {
    return { ECONOMICO: 'Esencial', ESTANDAR: 'Rendimiento', PROFESIONAL: 'Profesional' }[
      this.product().quality
    ];
  }
  get stockLabel() {
    return {
      disponible: 'Disponible',
      'pocas-unidades': 'Pocas unidades',
      agotado: 'Agotado',
      consultar: 'Consultar',
    }[this.product().stockStatus];
  }
}
