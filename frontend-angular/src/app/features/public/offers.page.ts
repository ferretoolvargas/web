import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Offer, Product, Promotion } from '../../core/models/domain.models';
import { CampaignService } from '../../core/services/campaign.service';
import { CatalogService } from '../../core/services/catalog.service';
import { EmptyState, ProductCard, Spinner } from '../../shared/ui';
import { COMMERCIAL_STATUS } from '../../core/config/brand.config';

@Component({
  imports: [DatePipe, ReactiveFormsModule, ProductCard, Spinner, EmptyState],
  template: `<section class="page">
    <header class="page-heading">
      <span class="eyebrow">Precios y condiciones especiales</span>
      <h1>Ofertas y promociones vigentes</h1>
      <p>Revisa la vigencia y las condiciones antes de realizar tu consulta.</p>
    </header>
    @if (!commercial.campaignsConfirmed) {
      <app-empty
        title="Promociones por confirmar"
        message="Consulta por WhatsApp las condiciones comerciales vigentes."
      />
    }
    @for (promotion of commercial.campaignsConfirmed ? promotions() : []; track promotion.id) {
      <article class="promotion-banner">
        <div>
          <span class="eyebrow">{{ promotion.type }}</span>
          <h2>{{ promotion.name }}</h2>
          <p>{{ promotion.description }}</p>
          <strong>Condiciones: {{ promotion.conditions }}</strong
          ><small>Válida hasta {{ promotion.endsAt | date: 'dd/MM/yyyy' }}</small>
        </div>
      </article>
    }
    @if (commercial.campaignsConfirmed && offers().length) {
      <section class="conditions-panel">
        <h2>Condiciones de ofertas</h2>
        <ul>
          @for (offer of offers(); track offer.id) {
            <li>
              <strong>{{ offer.name }}:</strong>
              {{ offer.conditions || 'Sujeto a disponibilidad.' }} Vigente hasta
              {{ offer.endsAt | date: 'dd/MM/yyyy' }}.
            </li>
          }
        </ul>
      </section>
    }
    @if (commercial.campaignsConfirmed) {
      <div class="results-heading">
        <h2>Productos con precio especial</h2>
        <label
          >Mostrar<select [formControl]="limit" (change)="changed()">
            <option [ngValue]="12">12</option>
            <option [ngValue]="24">24</option>
            <option [ngValue]="48">48</option>
          </select></label
        >
      </div>
      @if (loading()) {
        <app-spinner />
      } @else if (!products().length) {
        <app-empty
          title="No hay ofertas vigentes"
          message="Vuelve pronto o consulta por WhatsApp."
        />
      } @else {
        <div class="product-grid">
          @for (product of products(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
        <nav class="pagination">
          <button [disabled]="page() === 1" (click)="go(-1)">Anterior</button
          ><span>Página {{ page() }} de {{ pages() }}</span
          ><button [disabled]="page() === pages()" (click)="go(1)">Siguiente</button>
        </nav>
      }
    }
  </section>`,
})
export class OffersPage {
  readonly commercial = COMMERCIAL_STATUS;
  private catalog = inject(CatalogService);
  private campaigns = inject(CampaignService);
  readonly products = signal<Product[]>([]);
  readonly offers = signal<Offer[]>([]);
  readonly promotions = signal<Promotion[]>([]);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly loading = signal(true);
  readonly limit = new FormControl(12, { nonNullable: true });
  constructor() {
    this.load();
  }
  changed() {
    this.page.set(1);
    this.load();
  }
  go(delta: number) {
    this.page.update((value) => value + delta);
    this.load();
  }
  load() {
    this.loading.set(true);
    forkJoin({
      offers: this.catalog.offers(),
      promotions: this.campaigns.activePromotions(),
      products: this.catalog.products({
        page: this.page(),
        limit: this.limit.value,
        sortBy: 'discountPercent',
        sortOrder: 'desc',
        filters: { offer: true, publicVisible: true },
      }),
    }).subscribe((value) => {
      this.offers.set(value.offers.filter((item) => this.campaigns.isCurrent(item)));
      this.promotions.set(value.promotions);
      this.products.set(value.products.data);
      this.page.set(value.products.meta.page);
      this.pages.set(value.products.meta.totalPages);
      this.loading.set(false);
    });
  }
}
