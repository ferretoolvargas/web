import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardData } from '../../core/models/domain.models';
import { DashboardService } from '../../core/services/dashboard.service';
import { EmptyState, Spinner } from '../../shared/ui';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, EmptyState, Spinner],
  template: `<section class="admin-page">
    <header class="page-heading">
      <span class="eyebrow">Datos mock de desarrollo</span>
      <h1>Resumen del negocio</h1>
      <p>Una vista rápida del catálogo y la actividad simulada.</p>
    </header>
    @if (loading()) {
      <app-spinner />
    } @else if (error()) {
      <div class="state" role="alert">
        <h2>No pudimos cargar el resumen</h2>
        <p>{{ error() }}</p>
        <button class="button" (click)="load()">Reintentar</button>
      </div>
    } @else if (empty()) {
      <app-empty
        title="Todavía no hay actividad"
        message="Las métricas aparecerán cuando existan datos del negocio."
      />
    } @else if (data(); as summary) {
      <div class="metrics">
        <article>
          <span>Ventas del día</span
          ><strong>{{ summary.salesToday | currency: 'BOB' : 'symbol-narrow' }}</strong>
        </article>
        <article>
          <span>Productos activos</span><strong>{{ summary.activeProducts }}</strong>
        </article>
        <article>
          <span>Poco stock</span><strong>{{ summary.lowStock }}</strong>
        </article>
        <article>
          <span>Ofertas vigentes</span><strong>{{ summary.activeOffers }}</strong>
        </article>
      </div>
      <div class="admin-grid">
        <article class="panel">
          <h2>Accesos rápidos</h2>
          <div class="quick">
            <a routerLink="/admin/productos">Gestionar productos</a>
            <a routerLink="/admin/catalogos">Editar catálogos</a>
            <a routerLink="/admin/promociones">Crear promoción</a>
          </div>
        </article>
        <article class="panel">
          <h2>Movimientos recientes</h2>
          <ul class="activity-list">
            @for (movement of summary.recentMovements; track movement.id) {
              <li>
                <span>{{ movement.description }}</span>
                <small>{{ movement.occurredAt | date: 'dd/MM/yyyy, HH:mm' }}</small>
              </li>
            } @empty {
              <li>No hay movimientos recientes.</li>
            }
          </ul>
        </article>
        <article class="panel">
          <h2>Productos más consultados</h2>
          <p><small>Información mock durante desarrollo.</small></p>
          <ol class="activity-list">
            @for (product of summary.popularProducts; track product.productId) {
              <li>
                <span>{{ product.name }}</span>
                <strong>{{ product.consultations }} consultas</strong>
              </li>
            } @empty {
              <li>No hay consultas registradas.</li>
            }
          </ol>
        </article>
      </div>
    }
  </section>`,
})
export class DashboardPage {
  private dashboard = inject(DashboardService);
  readonly data = signal<DashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    this.load();
  }

  empty(): boolean {
    const value = this.data();
    return (
      !!value &&
      !value.salesToday &&
      !value.activeProducts &&
      !value.lowStock &&
      !value.activeOffers &&
      !value.recentMovements.length &&
      !value.popularProducts.length
    );
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.dashboard.getSummary().subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Verifica la fuente de datos e inténtalo nuevamente.');
        this.loading.set(false);
      },
    });
  }
}
