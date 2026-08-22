import { Component, inject, signal } from '@angular/core';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard } from '../../shared/ui';
@Component({
  imports: [ProductCard],
  template: `<section class="page">
    <header class="page-heading">
      <span class="eyebrow">Precios especiales</span>
      <h1>Ofertas vigentes</h1>
      <p>Consulta las condiciones y vigencia antes de comprar.</p>
    </header>
    <div class="product-grid">
      @for (product of products(); track product.id) {
        <app-product-card [product]="product" />
      } @empty {
        <div class="state">No hay ofertas vigentes en este momento.</div>
      }
    </div>
  </section>`,
})
export class OffersPage {
  private catalog = inject(CatalogService);
  products = signal<Product[]>([]);
  constructor() {
    this.catalog.offers().subscribe((offers) => {
      const active = offers.filter(
        (o) =>
          o.active && Date.parse(o.startsAt) <= Date.now() && Date.parse(o.endsAt) >= Date.now(),
      );
      this.catalog
        .products({ page: 1, limit: 48 })
        .subscribe((r) =>
          this.products.set(r.data.filter((p) => active.some((o) => o.productIds.includes(p.id)))),
        );
    });
  }
}
