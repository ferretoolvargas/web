import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { EmptyState, Spinner } from '../../shared/ui';

@Component({
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, EmptyState, Spinner],
  template: `<section class="admin-page">
    <header class="section-heading">
      <div>
        <span class="eyebrow">Catálogo comercial</span>
        <h1>Productos</h1>
      </div>
      <a class="button" routerLink="/admin/productos/nuevo">Nuevo producto</a>
    </header>
    <div class="toolbar product-filters">
      <label
        >Buscar<input [formControl]="search" placeholder="Nombre, SKU, código o modelo"
      /></label>
      <label
        >Calidad<select [formControl]="quality">
          <option value="">Todas</option>
          <option value="ECONOMICO">Económico</option>
          <option value="ESTANDAR">Estándar</option>
          <option value="PROFESIONAL">Profesional</option>
        </select></label
      >
      <label
        >Disponibilidad<select [formControl]="stockStatus">
          <option value="">Todas</option>
          <option value="disponible">Disponible</option>
          <option value="pocas-unidades">Pocas unidades</option>
          <option value="agotado">Agotado</option>
          <option value="consultar">Consultar</option>
        </select></label
      >
      <label
        >Estado<select [formControl]="active">
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select></label
      >
      <label
        >Orden<select [formControl]="sort">
          <option value="name:asc">Nombre A–Z</option>
          <option value="price:asc">Menor precio</option>
          <option value="price:desc">Mayor precio</option>
          <option value="createdAt:desc">Más recientes</option>
          <option value="stock:asc">Menor stock</option>
        </select></label
      >
      <label
        >Por página<select [formControl]="limit">
          <option [ngValue]="10">10</option>
          <option [ngValue]="25">25</option>
          <option [ngValue]="50">50</option>
          <option [ngValue]="100">100</option>
        </select></label
      >
    </div>
    @if (loading()) {
      <app-spinner />
    } @else if (error()) {
      <div class="state" role="alert">
        <h2>No se pudieron cargar los productos</h2>
        <button class="button" (click)="load()">Reintentar</button>
      </div>
    } @else if (!products().length) {
      <app-empty title="Sin productos" message="Modifica los filtros o crea un producto." />
    } @else {
      <div class="table-wrap panel">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Calidad</th>
              <th>Precio</th>
              <th>Stock informativo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (product of products(); track product.id) {
              <tr>
                <td>
                  <strong>{{ product.name }}</strong
                  ><small>{{ product.model || product.slug }}</small>
                </td>
                <td>{{ product.sku }}</td>
                <td>{{ qualityLabel(product) }}</td>
                <td>{{ product.price | currency: 'BOB' : 'symbol-narrow' }}</td>
                <td>{{ product.stock }} · {{ product.stockStatus }}</td>
                <td>{{ product.active ? 'Activo' : 'Inactivo' }}</td>
                <td class="table-actions">
                  <a [routerLink]="['/productos', product.slug]" target="_blank">Ver</a
                  ><a [routerLink]="['/admin/productos', product.id, 'editar']">Editar</a
                  ><button (click)="toggle(product)">
                    {{ product.active ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <nav class="pagination" aria-label="Paginación de productos">
        <button [disabled]="page() === 1" (click)="go(-1)">Anterior</button
        ><span>Página {{ page() }} de {{ pages() }} · {{ total() }} productos</span
        ><button [disabled]="page() === pages()" (click)="go(1)">Siguiente</button>
      </nav>
    }
  </section>`,
})
export class ProductsPage {
  private catalog = inject(CatalogService);
  readonly products = signal<Product[]>([]);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly search = new FormControl('', { nonNullable: true });
  readonly quality = new FormControl('', { nonNullable: true });
  readonly stockStatus = new FormControl('', { nonNullable: true });
  readonly active = new FormControl('', { nonNullable: true });
  readonly sort = new FormControl('name:asc', { nonNullable: true });
  readonly limit = new FormControl(10, { nonNullable: true });

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.search.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(destroyRef))
      .subscribe(() => this.changed());
    this.quality.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.changed());
    this.stockStatus.valueChanges
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => this.changed());
    this.active.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.changed());
    this.sort.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.changed());
    this.limit.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.changed());
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    const [sortBy, sortOrder] = this.sort.value.split(':') as [string, 'asc' | 'desc'];
    this.catalog
      .products({
        page: this.page(),
        limit: this.limit.value,
        search: this.search.value,
        sortBy,
        sortOrder,
        filters: {
          quality: this.quality.value || undefined,
          stockStatus: this.stockStatus.value || undefined,
          active: this.active.value || undefined,
        },
      })
      .subscribe({
        next: (response) => {
          this.products.set(response.data);
          this.page.set(response.meta.page);
          this.pages.set(response.meta.totalPages);
          this.total.set(response.meta.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
  go(delta: number): void {
    this.page.update((value) => value + delta);
    this.load();
  }
  toggle(product: Product): void {
    if (confirm(`¿${product.active ? 'Desactivar' : 'Activar'} ${product.name}?`))
      this.catalog.save({ ...product, active: !product.active }).subscribe(() => this.load());
  }
  qualityLabel(product: Product): string {
    return { ECONOMICO: 'Económico', ESTANDAR: 'Estándar', PROFESIONAL: 'Profesional' }[
      product.quality
    ];
  }
  private changed(): void {
    this.page.set(1);
    this.load();
  }
}
