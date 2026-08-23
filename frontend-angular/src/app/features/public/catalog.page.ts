import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, forkJoin } from 'rxjs';
import { AdminCatalogItem } from '../../core/models/admin-catalog.models';
import { Product } from '../../core/models/domain.models';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { CatalogService } from '../../core/services/catalog.service';
import { EmptyState, ProductCard } from '../../shared/ui';

@Component({
  imports: [ReactiveFormsModule, ProductCard, EmptyState],
  template: `<section class="page">
    <header class="page-heading">
      <span class="eyebrow">Catálogo</span>
      <h1>Herramientas y materiales</h1>
      <p>Busca por nombre, código o uso y compara opciones Económicas, Estándar y Profesionales.</p>
    </header>
    <div class="catalog-search">
      <label
        >Buscar productos<input
          [formControl]="search"
          type="search"
          placeholder="Ej. taladro, broca o pintura" /></label
      ><button
        class="filter-toggle"
        (click)="filtersOpen.update((value) => !value)"
        aria-controls="public-filters"
        [attr.aria-expanded]="filtersOpen()"
      >
        Filtros</button
      ><label
        >Ordenar<select [formControl]="sort">
          <option value="relevance:asc">Relevancia</option>
          <option value="price:asc">Menor precio</option>
          <option value="price:desc">Mayor precio</option>
          <option value="createdAt:desc">Más nuevos</option>
          <option value="discountPercent:desc">Mayor descuento</option>
        </select></label
      >
    </div>
    <div class="public-catalog-layout">
      <aside id="public-filters" class="public-filters" [class.open]="filtersOpen()">
        <div class="section-heading">
          <h2>Filtros</h2>
          <button type="button" (click)="clear()">Limpiar</button>
        </div>
        <label
          >Categoría<select [formControl]="category">
            <option value="">Todas</option>
            @for (item of categories(); track item.id) {
              <option [value]="item.id">{{ item.name }}</option>
            }
          </select></label
        ><label
          >Subcategoría<select [formControl]="subcategory">
            <option value="">Todas</option>
            @for (item of visibleSubcategories; track item.id) {
              <option [value]="item.id">{{ item.name }}</option>
            }
          </select></label
        ><label
          >Marca<select [formControl]="brand">
            <option value="">Todas</option>
            @for (item of brands(); track item.id) {
              <option [value]="item.id">{{ item.name }}</option>
            }
          </select></label
        ><label
          >Calidad<select [formControl]="quality">
            <option value="">Todas</option>
            <option value="ECONOMICO">Económico</option>
            <option value="ESTANDAR">Estándar</option>
            <option value="PROFESIONAL">Profesional</option>
          </select></label
        >
        <div class="price-range">
          <label
            >Precio desde<input
              [formControl]="minPrice"
              type="number"
              min="0"
              placeholder="Bs 0" /></label
          ><label
            >Precio hasta<input
              [formControl]="maxPrice"
              type="number"
              min="0"
              placeholder="Sin límite"
          /></label>
        </div>
        <label
          >Disponibilidad<select [formControl]="availability">
            <option value="">Todas</option>
            <option value="disponible">Disponible</option>
            <option value="pocas-unidades">Pocas unidades</option>
            <option value="agotado">Agotado</option>
            <option value="consultar">Consultar</option>
          </select></label
        ><label class="check-filter"
          ><input [formControl]="offer" type="checkbox" /> Solo productos en oferta</label
        >
      </aside>
      <div class="catalog-results">
        <div class="results-heading">
          <p>
            <strong>{{ total() }}</strong> productos encontrados
          </p>
          <label
            >Mostrar<select [formControl]="limit">
              <option [ngValue]="12">12</option>
              <option [ngValue]="24">24</option>
              <option [ngValue]="48">48</option>
            </select></label
          >
        </div>
        @if (loading()) {
          <div class="product-grid" aria-label="Cargando productos">
            @for (item of skeletons; track $index) {
              <div class="product-card skeleton">
                <div></div>
                <span></span><span></span><span></span>
              </div>
            }
          </div>
        } @else if (error()) {
          <div class="state" role="alert">
            <h2>No pudimos cargar el catálogo</h2>
            <p>{{ error() }}</p>
            <button class="button" (click)="load()">Reintentar</button>
          </div>
        } @else if (!products().length) {
          <app-empty
            title="No encontramos productos"
            message="Prueba quitando algunos filtros o usando otra búsqueda."
          />
        } @else {
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
      </div>
    </div>
  </section>`,
})
export class CatalogPage {
  private catalog = inject(CatalogService);
  private catalogs = inject(AdminCatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private params = this.route.snapshot.queryParamMap;
  readonly search = this.control('q');
  readonly category = this.control('categoria');
  readonly subcategory = this.control('subcategoria');
  readonly brand = this.control('marca');
  readonly quality = this.control('calidad');
  readonly minPrice = this.control('precioMin');
  readonly maxPrice = this.control('precioMax');
  readonly availability = this.control('disponibilidad');
  readonly offer = new FormControl(this.params.get('oferta') === 'true', { nonNullable: true });
  readonly sort = new FormControl(this.params.get('orden') ?? 'relevance:asc', {
    nonNullable: true,
  });
  readonly limit = new FormControl(Number(this.params.get('limite')) || 12, { nonNullable: true });
  readonly categories = signal<AdminCatalogItem[]>([]);
  readonly subcategories = signal<AdminCatalogItem[]>([]);
  readonly brands = signal<AdminCatalogItem[]>([]);
  readonly products = signal<Product[]>([]);
  readonly page = signal(Number(this.params.get('pagina')) || 1);
  readonly pages = signal(1);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly filtersOpen = signal(false);
  readonly skeletons = Array(8);
  constructor() {
    forkJoin({
      categories: this.catalogs.all('categories'),
      subcategories: this.catalogs.all('subcategories'),
      brands: this.catalogs.all('brands'),
    }).subscribe((value) => {
      this.categories.set(value.categories.filter((item) => item.active));
      this.subcategories.set(value.subcategories.filter((item) => item.active));
      this.brands.set(value.brands.filter((item) => item.active));
    });
    this.search.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed());
    for (const control of [
      this.category,
      this.subcategory,
      this.brand,
      this.quality,
      this.minPrice,
      this.maxPrice,
      this.availability,
      this.sort,
    ])
      control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.changed());
    this.offer.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed());
    this.limit.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changed());
    this.load();
  }
  get visibleSubcategories() {
    return this.subcategories().filter(
      (item) => !this.category.value || item.categoryId === this.category.value,
    );
  }
  go(delta: number) {
    this.page.update((value) => value + delta);
    this.load();
    globalThis.scrollTo?.({ top: 0, behavior: 'smooth' });
  }
  clear() {
    for (const control of [
      this.category,
      this.subcategory,
      this.brand,
      this.quality,
      this.minPrice,
      this.maxPrice,
      this.availability,
    ])
      control.setValue('', { emitEvent: false });
    this.offer.setValue(false, { emitEvent: false });
    this.page.set(1);
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    const [sortBy, sortOrder] = this.sort.value.split(':') as [string, 'asc' | 'desc'];
    this.catalog
      .products({
        page: this.page(),
        limit: this.limit.value,
        search: this.search.value,
        sortBy: sortBy === 'relevance' ? undefined : sortBy,
        sortOrder,
        filters: {
          categoryId: this.category.value || undefined,
          subcategoryId: this.subcategory.value || undefined,
          brandId: this.brand.value || undefined,
          quality: this.quality.value || undefined,
          minPrice: this.minPrice.value || undefined,
          maxPrice: this.maxPrice.value || undefined,
          stockStatus: this.availability.value || undefined,
          offer: this.offer.value || undefined,
          publicVisible: true,
        },
      })
      .subscribe({
        next: (response) => {
          this.products.set(response.data);
          this.page.set(response.meta.page);
          this.pages.set(response.meta.totalPages);
          this.total.set(response.meta.total);
          this.loading.set(false);
          this.syncUrl();
        },
        error: () => {
          this.error.set('Verifica tu conexión e inténtalo nuevamente.');
          this.loading.set(false);
        },
      });
  }
  private changed() {
    this.page.set(1);
    if (
      this.category.value &&
      !this.visibleSubcategories.some((item) => item.id === this.subcategory.value)
    )
      this.subcategory.setValue('', { emitEvent: false });
    this.load();
  }
  private control(name: string) {
    return new FormControl(this.params.get(name) ?? '', { nonNullable: true });
  }
  private syncUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        q: this.search.value || null,
        categoria: this.category.value || null,
        subcategoria: this.subcategory.value || null,
        marca: this.brand.value || null,
        calidad: this.quality.value || null,
        precioMin: this.minPrice.value || null,
        precioMax: this.maxPrice.value || null,
        disponibilidad: this.availability.value || null,
        oferta: this.offer.value || null,
        orden: this.sort.value === 'relevance:asc' ? null : this.sort.value,
        limite: this.limit.value === 12 ? null : this.limit.value,
        pagina: this.page() > 1 ? this.page() : null,
      },
    });
  }
}
