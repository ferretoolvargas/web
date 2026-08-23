import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { AdminCatalogItem, CatalogKind } from '../../core/models/admin-catalog.models';
import { QualityLevel, ValidationError } from '../../core/models/domain.models';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { EmptyState, Spinner } from '../../shared/ui';

const TABS: { kind: CatalogKind; label: string }[] = [
  { kind: 'categories', label: 'Categorías' },
  { kind: 'subcategories', label: 'Subcategorías' },
  { kind: 'brands', label: 'Marcas' },
  { kind: 'units', label: 'Unidades' },
  { kind: 'qualities', label: 'Calidades' },
];

@Component({
  imports: [ReactiveFormsModule, EmptyState, Spinner],
  template: `<section class="admin-page">
    <header class="page-heading">
      <span class="eyebrow">Configuración</span>
      <h1>Catálogos</h1>
      <p>Categorías, subcategorías, marcas, unidades y niveles de calidad.</p>
    </header>
    <div class="tabs" role="tablist" aria-label="Tipo de catálogo">
      @for (tab of tabs; track tab.kind) {
        <button
          role="tab"
          [attr.aria-selected]="kind() === tab.kind"
          (click)="selectKind(tab.kind)"
          [class.active]="kind() === tab.kind"
        >
          {{ tab.label }}
        </button>
      }
    </div>

    <div class="catalog-admin-grid">
      <div>
        <div class="toolbar">
          <label
            >Buscar
            <input [formControl]="search" type="search" placeholder="Nombre o descripción" />
          </label>
          <label
            >Estado
            <select [formControl]="status">
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </label>
          <label
            >Orden
            <select [formControl]="order">
              <option value="asc">Nombre A–Z</option>
              <option value="desc">Nombre Z–A</option>
            </select>
          </label>
          <label
            >Por página
            <select [formControl]="limit">
              <option [ngValue]="10">10</option>
              <option [ngValue]="25">25</option>
              <option [ngValue]="50">50</option>
              <option [ngValue]="100">100</option>
            </select>
          </label>
        </div>

        @if (loading()) {
          <app-spinner />
        } @else if (loadError()) {
          <div class="state" role="alert">
            <h2>No se pudo cargar el catálogo</h2>
            <button class="button" (click)="load()">Reintentar</button>
          </div>
        } @else if (!items().length) {
          <app-empty title="Sin registros" message="Crea un registro o modifica la búsqueda." />
        } @else {
          <div class="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Slug</th>
                  <th>Detalle</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id) {
                  <tr>
                    <td>
                      <strong>{{ item.name }}</strong>
                    </td>
                    <td>
                      <code>{{ item.slug }}</code>
                    </td>
                    <td>{{ detail(item) }}</td>
                    <td>{{ item.active ? 'Activo' : 'Inactivo' }}</td>
                    <td class="table-actions">
                      <button (click)="edit(item)">Editar</button>
                      <button (click)="toggle(item)">
                        {{ item.active ? 'Desactivar' : 'Activar' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <nav class="pagination" aria-label="Paginación de catálogos">
            <button [disabled]="page() === 1" (click)="changePage(-1)">Anterior</button>
            <span>Página {{ page() }} de {{ totalPages() }} · {{ total() }} registros</span>
            <button [disabled]="page() === totalPages()" (click)="changePage(1)">Siguiente</button>
          </nav>
        }
      </div>

      <form class="panel catalog-form" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="section-heading">
          <h2>{{ editingId() ? 'Editar' : 'Crear' }} {{ singularLabel }}</h2>
          @if (editingId()) {
            <button type="button" (click)="resetForm()">Cancelar</button>
          }
        </div>
        <label
          >Nombre
          <input #firstField formControlName="name" maxlength="80" />
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <small class="field-error">El nombre debe tener entre 2 y 80 caracteres.</small>
          }
        </label>
        <label
          >Slug
          <input formControlName="slug" maxlength="90" />
          @if (form.controls.slug.touched && form.controls.slug.invalid) {
            <small class="field-error">Usa minúsculas, números y guiones.</small>
          }
        </label>
        <label
          >Descripción
          <textarea formControlName="description" rows="3" maxlength="240"></textarea>
        </label>
        @if (kind() === 'categories') {
          <label
            >Categoría superior
            <select formControlName="parentId">
              <option value="">Ninguna</option>
              @for (parent of categories(); track parent.id) {
                @if (parent.id !== editingId()) {
                  <option [value]="parent.id">{{ parent.name }}</option>
                }
              }
            </select>
          </label>
        }
        @if (kind() === 'subcategories') {
          <label
            >Categoría
            <select formControlName="categoryId">
              <option value="">Selecciona una categoría</option>
              @for (category of categories(); track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </label>
        }
        @if (kind() === 'units') {
          <label>Abreviatura <input formControlName="abbreviation" maxlength="12" /></label>
        }
        @if (kind() === 'qualities') {
          <label
            >Código público
            <select formControlName="qualityCode">
              <option value="ECONOMICO">Económico</option>
              <option value="ESTANDAR">Estándar</option>
              <option value="PROFESIONAL">Profesional</option>
            </select>
          </label>
        }
        @if (kind() === 'brands') {
          <label>Sitio web opcional <input type="url" formControlName="website" /></label>
          <label>URL de logo opcional <input type="url" formControlName="logoUrl" /></label>
        }
        @if (saveError()) {
          <div class="alert danger" role="alert">{{ saveError() }}</div>
        }
        <button class="button" [disabled]="saving()">
          {{ saving() ? 'Guardando…' : 'Guardar' }}
        </button>
      </form>
    </div>
  </section>`,
})
export class CatalogsPage {
  private repository = inject(AdminCatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);
  readonly tabs = TABS;
  readonly kind = signal<CatalogKind>(this.initialKind());
  readonly items = signal<AdminCatalogItem[]>([]);
  readonly categories = signal<AdminCatalogItem[]>([]);
  readonly page = signal(Number(this.route.snapshot.queryParamMap.get('page')) || 1);
  readonly total = signal(0);
  readonly totalPages = signal(1);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal('');
  readonly editingId = signal('');
  readonly search = new FormControl(this.route.snapshot.queryParamMap.get('search') ?? '', {
    nonNullable: true,
  });
  readonly status = new FormControl(this.route.snapshot.queryParamMap.get('active') ?? '', {
    nonNullable: true,
  });
  readonly order = new FormControl<'asc' | 'desc'>('asc', { nonNullable: true });
  readonly limit = new FormControl(10, { nonNullable: true });
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(240)],
    }),
    parentId: new FormControl('', { nonNullable: true }),
    categoryId: new FormControl('', { nonNullable: true }),
    abbreviation: new FormControl('', { nonNullable: true }),
    qualityCode: new FormControl<QualityLevel>('ESTANDAR', { nonNullable: true }),
    website: new FormControl('', { nonNullable: true }),
    logoUrl: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filtersChanged());
    this.status.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filtersChanged());
    this.order.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
    this.limit.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filtersChanged());
    this.form.controls.name.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => {
        if (!this.editingId())
          this.form.controls.slug.setValue(this.slugify(name), { emitEvent: false });
      });
    this.loadCategories();
    this.load();
  }

  get singularLabel(): string {
    return {
      categories: 'categoría',
      subcategories: 'subcategoría',
      brands: 'marca',
      units: 'unidad',
      qualities: 'calidad',
    }[this.kind()];
  }

  selectKind(kind: CatalogKind): void {
    this.kind.set(kind);
    this.page.set(1);
    this.resetForm();
    this.load();
  }

  changePage(delta: number): void {
    this.page.update((value) => value + delta);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.repository
      .list(this.kind(), {
        page: this.page(),
        limit: this.limit.value,
        search: this.search.value,
        sortBy: 'name',
        sortOrder: this.order.value,
        filters: { active: this.status.value },
      })
      .subscribe({
        next: (response) => {
          this.items.set(response.data);
          this.page.set(response.meta.page);
          this.total.set(response.meta.total);
          this.totalPages.set(response.meta.totalPages);
          this.loading.set(false);
          this.syncUrl();
        },
        error: () => {
          this.loadError.set(true);
          this.loading.set(false);
        },
      });
  }

  edit(item: AdminCatalogItem): void {
    this.editingId.set(item.id);
    this.form.patchValue({
      name: item.name,
      slug: item.slug,
      description: item.description,
      parentId: item.parentId ?? '',
      categoryId: item.categoryId ?? '',
      abbreviation: item.abbreviation ?? '',
      qualityCode: item.qualityCode ?? 'ESTANDAR',
      website: item.website ?? '',
      logoUrl: item.logoUrl ?? '',
    });
    this.focusFirst();
  }

  save(): void {
    this.applyContextValidators();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusInvalid();
      return;
    }
    this.saving.set(true);
    this.saveError.set('');
    const value = this.form.getRawValue();
    const item: AdminCatalogItem = {
      id: this.editingId() || crypto.randomUUID(),
      kind: this.kind(),
      name: value.name.trim(),
      slug: value.slug,
      description: value.description.trim(),
      active: this.items().find((current) => current.id === this.editingId())?.active ?? true,
      parentId: value.parentId || undefined,
      categoryId: value.categoryId || undefined,
      abbreviation: value.abbreviation || undefined,
      qualityCode: this.kind() === 'qualities' ? value.qualityCode : undefined,
      website: value.website || undefined,
      logoUrl: value.logoUrl || undefined,
    };
    this.repository.save(item).subscribe({
      next: () => {
        this.saving.set(false);
        this.resetForm();
        this.loadCategories();
        this.load();
      },
      error: (error: ValidationError) => {
        this.saveError.set(error.message ?? 'No se pudo guardar el registro.');
        this.saving.set(false);
      },
    });
  }

  toggle(item: AdminCatalogItem): void {
    if (!confirm(`¿${item.active ? 'Desactivar' : 'Activar'} ${item.name}?`)) return;
    this.repository
      .toggle(item.id)
      .subscribe({ next: () => this.load(), error: () => this.loadError.set(true) });
  }

  resetForm(): void {
    this.editingId.set('');
    this.saveError.set('');
    this.form.reset({
      name: '',
      slug: '',
      description: '',
      parentId: '',
      categoryId: '',
      abbreviation: '',
      qualityCode: 'ESTANDAR',
      website: '',
      logoUrl: '',
    });
  }

  detail(item: AdminCatalogItem): string {
    if (item.abbreviation) return item.abbreviation;
    if (item.qualityCode) return item.description;
    if (item.categoryId)
      return this.categories().find((category) => category.id === item.categoryId)?.name ?? '—';
    return item.description || '—';
  }

  private filtersChanged(): void {
    this.page.set(1);
    this.load();
  }

  private loadCategories(): void {
    this.repository.all('categories').subscribe((items) => this.categories.set(items));
  }

  private syncUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        type: this.kind(),
        page: this.page() > 1 ? this.page() : null,
        search: this.search.value || null,
        active: this.status.value || null,
      },
    });
  }

  private applyContextValidators(): void {
    this.form.controls.categoryId.setValidators(
      this.kind() === 'subcategories' ? [Validators.required] : [],
    );
    this.form.controls.abbreviation.setValidators(
      this.kind() === 'units' ? [Validators.required] : [],
    );
    this.form.controls.categoryId.updateValueAndValidity({ emitEvent: false });
    this.form.controls.abbreviation.updateValueAndValidity({ emitEvent: false });
  }

  private initialKind(): CatalogKind {
    const value = this.route.snapshot.queryParamMap.get('type') as CatalogKind | null;
    return TABS.some((tab) => tab.kind === value) ? value! : 'categories';
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private focusInvalid(): void {
    setTimeout(() =>
      this.document.querySelector<HTMLElement>('.catalog-form .ng-invalid')?.focus(),
    );
  }

  private focusFirst(): void {
    setTimeout(() => this.document.querySelector<HTMLElement>('.catalog-form input')?.focus());
  }
}
