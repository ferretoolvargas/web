import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND_INFO } from '../../core/config/brand.config';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { Icon, ProductCard, Spinner } from '../../shared/ui';
@Component({
  imports: [RouterLink, ProductCard, Spinner, Icon],
  template: `<section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Ferretería en Bolivia</span>
        <h1>La herramienta correcta <em>para cada trabajo.</em></h1>
        <p>
          Encuentra soluciones confiables para el hogar, el taller y la obra, organizadas por uso y
          nivel de exigencia.
        </p>
        <div class="actions">
          <a class="button" routerLink="/catalogo">Explorar catálogo</a
          ><a
            class="button secondary"
            [href]="brand.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            >Consultar por WhatsApp</a
          >
        </div>
      </div>
      <div
        class="hero-visual"
        role="img"
        aria-label="Espacio reservado para la imagen principal de herramientas"
      >
        <app-icon name="tool" /><strong>IMAGEN HERO</strong
        ><small>Fotografía principal de herramientas</small>
      </div>
      <div class="hero-benefits">
        <span
          ><app-icon name="shield" /><b>Productos seleccionados</b
          ><small>Opciones para cada exigencia</small></span
        ><span
          ><app-icon name="support" /><b>Atención personalizada</b
          ><small>Te ayudamos a elegir</small></span
        ><span
          ><app-icon name="truck" /><b>Consulta directa</b
          ><small>Disponibilidad por WhatsApp</small></span
        >
      </div>
    </section>
    <section class="section categories-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Explora</span>
          <h2>Categorías principales</h2>
        </div>
        <a routerLink="/catalogo">Ver catálogo <app-icon name="arrow" /></a>
      </div>
      <div class="category-grid">
        @for (category of categories; track category.id) {
          <a class="category-card" routerLink="/catalogo" [queryParams]="{ categoria: category.id }"
            ><app-icon [name]="category.icon" /><span>{{ category.name }}</span></a
          >
        }
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Selección</span>
          <h2>Productos destacados</h2>
        </div>
        <a routerLink="/catalogo">Ver todos <app-icon name="arrow" /></a>
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
    <section class="benefits" aria-label="Beneficios">
      <article>
        <app-icon name="shield" />
        <div>
          <strong>Calidad orientada a tu uso</strong><span>Elige por nivel de exigencia</span>
        </div>
      </article>
      <article>
        <app-icon name="tool" />
        <div><strong>Opciones claras</strong><span>Información para comparar</span></div>
      </article>
      <article>
        <app-icon name="support" />
        <div><strong>Atención personalizada</strong><span>Asesoría antes de elegir</span></div>
      </article>
      <article>
        <app-icon name="heart" />
        <div><strong>Compra informada</strong><span>Consulta los datos vigentes</span></div>
      </article>
    </section>
    <section class="contact">
      <h2>¿No sabes cuál elegir?</h2>
      <p>Cuéntanos qué trabajo necesitas realizar y te orientamos.</p>
      <a class="button" [href]="brand.whatsappUrl" target="_blank" rel="noopener noreferrer"
        >Hablar con Ferretool</a
      >
    </section>`,
})
export class HomePage {
  readonly brand = BRAND_INFO;
  private catalog = inject(CatalogService);
  products = signal<Product[]>([]);
  loading = signal(true);
  readonly categories = [
    { id: 'cat-electricas', name: 'Herramientas eléctricas', icon: 'bolt' as const },
    { id: 'cat-manuales', name: 'Herramientas manuales', icon: 'manual' as const },
    { id: 'cat-accesorios', name: 'Accesorios', icon: 'box' as const },
  ];
  constructor() {
    this.catalog.products({ page: 1, limit: 4, filters: { featured: true } }).subscribe((r) => {
      this.products.set(r.data);
      this.loading.set(false);
    });
  }
}
