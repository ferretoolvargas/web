import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Product } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { EmptyState, ProductCard, Spinner } from '../../shared/ui';
@Component({
  imports: [ReactiveFormsModule, ProductCard, Spinner, EmptyState],
  template: `<section class="page">
    <header class="page-heading">
      <span class="eyebrow">Catálogo</span>
      <h1>Herramientas y materiales</h1>
      <p>Busca por nombre, código o uso y compara la línea adecuada.</p>
    </header>
    <div class="catalog-tools">
      <label
        >Buscar productos<input
          [formControl]="search"
          type="search"
          placeholder="Ej. taladro, broca, pintura" /></label
      ><label
        >Ordenar<select (change)="sort.set($any($event.target).value); load()">
          <option value="name">Nombre</option>
          <option value="price">Menor precio</option>
          <option value="-price">Mayor precio</option>
          <option value="-createdAt">Más nuevos</option>
        </select></label
      ><label
        >Calidad<select (change)="quality.set($any($event.target).value); page.set(1); load()">
          <option value="">Todas</option>
          <option value="ECONOMICO">Económico</option>
          <option value="ESTANDAR">Estándar</option>
          <option value="PROFESIONAL">Profesional</option>
        </select></label
      >
    </div>
    @if (loading()) {
      <app-spinner />
    } @else if (error()) {
      <div class="alert danger">{{ error() }} <button (click)="load()">Reintentar</button></div>
    } @else if (!products().length) {
      <app-empty />
    } @else {
      <p>{{ total() }} productos encontrados</p>
      <div class="product-grid">
        @for (product of products(); track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
      <nav class="pagination" aria-label="Paginación">
        <button (click)="go(-1)" [disabled]="page() === 1">Anterior</button
        ><span>Página {{ page() }} de {{ pages() }}</span
        ><button (click)="go(1)" [disabled]="page() === pages()">Siguiente</button>
      </nav>
    }
  </section>`,
})
export class CatalogPage {
  private catalog = inject(CatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  search = new FormControl(this.route.snapshot.queryParamMap.get('q') ?? '', { nonNullable: true });
  quality = signal('');
  sort = signal('name');
  page = signal(Number(this.route.snapshot.queryParamMap.get('page')) || 1);
  products = signal<Product[]>([]);
  total = signal(0);
  pages = signal(1);
  loading = signal(true);
  error = signal('');
  constructor() {
    const destroy = inject(DestroyRef);
    const sub = this.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.page.set(1);
      this.load();
    });
    destroy.onDestroy(() => sub.unsubscribe());
    this.load();
  }
  go(delta: number) {
    this.page.update((v) => v + delta);
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    const sort = this.sort();
    this.catalog
      .products({
        page: this.page(),
        limit: 12,
        search: this.search.value,
        sortBy: sort.replace('-', ''),
        sortOrder: sort.startsWith('-') ? 'desc' : 'asc',
        filters: { quality: this.quality() || undefined, publicVisible: true },
      })
      .subscribe({
        next: (r) => {
          this.products.set(r.data);
          this.total.set(r.meta.total);
          this.pages.set(r.meta.totalPages);
          this.page.set(r.meta.page);
          this.loading.set(false);
          this.router.navigate([], {
            queryParams: {
              q: this.search.value || null,
              page: this.page() > 1 ? this.page() : null,
            },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        },
        error: () => {
          this.error.set('No pudimos cargar el catálogo.');
          this.loading.set(false);
        },
      });
  }
}
