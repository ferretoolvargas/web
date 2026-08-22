import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
@Component({
  imports: [CurrencyPipe, ReactiveFormsModule],
  template: `<section class="admin-page">
    <header class="section-heading">
      <div>
        <span class="eyebrow">Inventario visible</span>
        <h1>Productos</h1>
      </div>
      <button class="button" (click)="notice.set(true)">Nuevo producto</button>
    </header>
    @if (notice()) {
      <div class="alert">
        El editor estructurado queda listo para conectar en la siguiente iteración funcional.
        <button (click)="notice.set(false)">Cerrar</button>
      </div>
    }
    <div class="toolbar">
      <label
        >Buscar<input
          [formControl]="search"
          (keyup.enter)="load()"
          placeholder="Nombre, SKU o modelo" /></label
      ><button (click)="load()">Buscar</button
      ><label
        >Por página<select (change)="limit.set(+$any($event.target).value); page.set(1); load()">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select></label
      >
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>SKU</th>
            <th>Calidad</th>
            <th>Precio</th>
            <th>Disponibilidad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          @for (p of products(); track p.id) {
            <tr>
              <td>
                <strong>{{ p.name }}</strong
                ><small>{{ p.model }}</small>
              </td>
              <td>{{ p.sku }}</td>
              <td>{{ p.quality }}</td>
              <td>{{ p.price | currency: 'BOB' : 'symbol-narrow' }}</td>
              <td>{{ p.stockStatus }}</td>
              <td>
                <button (click)="toggle(p)">{{ p.active ? 'Activo' : 'Inactivo' }}</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6">Sin resultados</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <nav class="pagination">
      <button [disabled]="page() === 1" (click)="page.update((v) => v - 1); load()">Anterior</button
      ><span>Página {{ page() }} de {{ pages() }}</span
      ><button [disabled]="page() === pages()" (click)="page.update((v) => v + 1); load()">
        Siguiente
      </button>
    </nav>
  </section>`,
})
export class ProductsPage {
  private catalog = inject(CatalogService);
  products = signal<Product[]>([]);
  search = new FormControl('', { nonNullable: true });
  page = signal(1);
  limit = signal(10);
  pages = signal(1);
  notice = signal(false);
  constructor() {
    this.load();
  }
  load() {
    this.catalog
      .products({
        page: this.page(),
        limit: this.limit(),
        search: this.search.value,
        sortBy: 'name',
        sortOrder: 'asc',
      })
      .subscribe((r) => {
        this.products.set(r.data);
        this.pages.set(r.meta.totalPages);
        this.page.set(r.meta.page);
      });
  }
  toggle(p: Product) {
    if (confirm(`¿${p.active ? 'Desactivar' : 'Activar'} ${p.name}?`)) {
      this.catalog.save({ ...p, active: !p.active }).subscribe(() => this.load());
    }
  }
}
