import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard, Spinner } from '../../shared/ui';
@Component({
  imports: [RouterLink, ProductCard, Spinner],
  template: `<section class="hero">
      <div>
        <span class="eyebrow">Ferretería en Bolivia</span>
        <h1>La herramienta correcta para cada trabajo</h1>
        <p>
          Encuentra soluciones confiables para el hogar, el taller y la obra, organizadas por uso y
          nivel de exigencia.
        </p>
        <div class="actions">
          <a class="button" routerLink="/catalogo">Explorar catálogo</a
          ><a
            class="button secondary"
            href="https://wa.me/59160514138"
            target="_blank"
            rel="noopener"
            >Consultar por WhatsApp</a
          >
        </div>
      </div>
      <div class="hero-card">
        <span>Compra con confianza</span><strong>Orientación clara</strong>
        <p>Compara opciones Económicas, Estándar y Profesionales.</p>
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Selección</span>
          <h2>Productos destacados</h2>
        </div>
        <a routerLink="/catalogo">Ver todos →</a>
      </div>
      @if (loading()) {
        <app-spinner />
      } @else {
        <div class="product-grid">
          @for (product of products(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </section>
    <section class="contact">
      <h2>¿No sabes cuál elegir?</h2>
      <p>Cuéntanos qué trabajo necesitas realizar y te orientamos.</p>
      <a class="button" href="https://wa.me/59160514138" target="_blank" rel="noopener"
        >Hablar con Ferretools</a
      >
    </section>`,
})
export class HomePage {
  private catalog = inject(CatalogService);
  products = signal<Product[]>([]);
  loading = signal(true);
  constructor() {
    this.catalog.products({ page: 1, limit: 4, filters: { featured: true } }).subscribe((r) => {
      this.products.set(r.data);
      this.loading.set(false);
    });
  }
}
