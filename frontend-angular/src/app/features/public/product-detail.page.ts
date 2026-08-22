import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { Spinner } from '../../shared/ui';
@Component({
  imports: [CurrencyPipe, RouterLink, Spinner],
  template: `<section class="page">
    @if (loading()) {
      <app-spinner />
    } @else if (!product()) {
      <div class="state">
        <h1>Producto no encontrado</h1>
        <p>Es posible que el enlace haya cambiado.</p>
        <a class="button" routerLink="/catalogo">Volver al catálogo</a>
      </div>
    } @else {
      <nav class="breadcrumbs">
        <a routerLink="/">Inicio</a> / <a routerLink="/catalogo">Catálogo</a> /
        {{ product()!.name }}
      </nav>
      <div class="detail">
        <div class="detail-image">🔧</div>
        <article>
          <span class="eyebrow">{{ qualityLabel }}</span>
          <h1>{{ product()!.name }}</h1>
          <p class="lead">{{ product()!.summary }}</p>
          <strong class="detail-price">{{
            product()!.price | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO'
          }}</strong>
          <p class="stock">{{ product()!.stockStatus }}</p>
          <div class="actions">
            <a class="button" [href]="consultUrl" target="_blank" rel="noopener"
              >Consultar por WhatsApp</a
            ><a class="button secondary" [href]="shareUrl" target="_blank" rel="noopener"
              >Compartir</a
            >
          </div>
        </article>
      </div>
      <div class="detail-content">
        <section>
          <h2>¿Qué es?</h2>
          <p>{{ product()!.description }}</p>
          <h2>¿Para qué sirve?</h2>
          <p>{{ product()!.uses }}</p>
          <h2>Contenido del paquete</h2>
          <p>{{ product()!.packageContents }}</p>
        </section>
        <aside>
          <h2>Especificaciones</h2>
          <dl>
            @for (spec of product()!.specifications; track spec.label) {
              <div>
                <dt>{{ spec.label }}</dt>
                <dd>{{ spec.value }} {{ spec.unit }}</dd>
              </div>
            }
          </dl>
          @if (product()!.warranty) {
            <h3>Garantía</h3>
            <p>{{ product()!.warranty }}</p>
          }
          @if (product()!.origin) {
            <h3>Procedencia</h3>
            <p>{{ product()!.origin }}</p>
          }
        </aside>
      </div>
    }
  </section>`,
})
export class ProductDetailPage {
  private catalog = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  product = signal<Product | undefined>(undefined);
  loading = signal(true);
  constructor() {
    this.catalog.product(this.route.snapshot.paramMap.get('slug') ?? '').subscribe((p) => {
      this.product.set(p);
      this.loading.set(false);
      if (p) {
        this.title.setTitle(`${p.name} | Ferretools Vargas`);
        this.meta.updateTag({ name: 'description', content: p.summary });
        this.setCanonical();
      }
    });
  }
  get qualityLabel() {
    return this.product()?.quality === 'ECONOMICO'
      ? 'Económico'
      : this.product()?.quality === 'ESTANDAR'
        ? 'Estándar'
        : 'Profesional';
  }
  get canonical() {
    return this.document.location.href.split('?')[0];
  }
  get consultUrl() {
    const p = this.product();
    return `https://wa.me/59160514138?text=${encodeURIComponent(`Hola, deseo consultar por ${p?.name} (SKU ${p?.sku}), precio publicado Bs ${p?.price}. ${this.canonical}`)}`;
  }
  get shareUrl() {
    const p = this.product();
    return `https://wa.me/?text=${encodeURIComponent(`${p?.name} · Línea ${this.qualityLabel} · Bs ${p?.price} · ${p?.stockStatus}. ${this.canonical}`)}`;
  }
  private setCanonical() {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = this.canonical;
  }
}
