import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';
import { AdminCatalogItem } from '../../core/models/admin-catalog.models';
import {
  Product,
  ProductImage,
  ProductVariant,
  Specification,
} from '../../core/models/domain.models';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Spinner } from '../../shared/ui';

@Component({
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, Spinner],
  template: `<section class="admin-page product-editor">
    <header class="section-heading">
      <div>
        <span class="eyebrow">Catálogo</span>
        <h1>{{ productId ? 'Editar producto' : 'Nuevo producto' }}</h1>
        <p>Los campos estructurados alimentan la ficha pública y la futura API.</p>
      </div>
      <a routerLink="/admin/productos">Volver</a>
    </header>
    @if (loading()) {
      <app-spinner />
    } @else {
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="product-form-grid">
          <div class="form-sections">
            <fieldset>
              <legend>1. Identificación</legend>
              <div class="form-grid">
                <label>Nombre<input formControlName="name" maxlength="120" /></label
                ><label>SKU<input formControlName="sku" maxlength="40" /></label
                ><label>Código de barras<input formControlName="barcode" maxlength="40" /></label
                ><label>Modelo<input formControlName="model" maxlength="60" /></label
                ><label class="wide">Slug<input formControlName="slug" maxlength="140" /></label>
              </div>
            </fieldset>
            <fieldset>
              <legend>2. Clasificación</legend>
              <div class="form-grid">
                <label
                  >Categoría<select formControlName="categoryId">
                    <option value="">Selecciona</option>
                    @for (item of categories(); track item.id) {
                      <option [value]="item.id">{{ item.name }}</option>
                    }
                  </select></label
                ><label
                  >Subcategoría<select formControlName="subcategoryId">
                    <option value="">Sin subcategoría</option>
                    @for (item of subcategories(); track item.id) {
                      <option [value]="item.id">{{ item.name }}</option>
                    }
                  </select></label
                ><label
                  >Marca<select formControlName="brandId">
                    <option value="">Sin marca</option>
                    @for (item of brands(); track item.id) {
                      <option [value]="item.id">{{ item.name }}</option>
                    }
                  </select></label
                ><label
                  >Línea<select formControlName="quality">
                    <option value="ECONOMICO">Económico</option>
                    <option value="ESTANDAR">Estándar</option>
                    <option value="PROFESIONAL">Profesional</option>
                  </select></label
                >
              </div>
            </fieldset>
            <fieldset>
              <legend>3. Contenido comercial</legend>
              <label
                >Resumen ({{ form.controls.summary.value.length }}/180)<textarea
                  formControlName="summary"
                  maxlength="180"
                  rows="2"
                ></textarea></label
              ><label
                >¿Qué es? ({{ form.controls.description.value.length }}/2000)<textarea
                  formControlName="description"
                  maxlength="2000"
                  rows="5"
                ></textarea></label
              ><label
                >¿Para qué sirve?<textarea
                  formControlName="uses"
                  maxlength="800"
                  rows="3"
                ></textarea></label
              ><label
                >Contenido del paquete<textarea
                  formControlName="packageContents"
                  maxlength="600"
                  rows="3"
                ></textarea>
              </label>
            </fieldset>
            <fieldset>
              <legend>4. Información comercial</legend>
              <div class="form-grid">
                <label
                  >Costo (Bs)<input
                    type="number"
                    min="0"
                    step="0.01"
                    formControlName="cost" /></label
                ><label
                  >Precio (Bs)<input
                    type="number"
                    min="0"
                    step="0.01"
                    formControlName="price" /></label
                ><label
                  >Precio mayorista opcional<input
                    type="number"
                    min="0"
                    step="0.01"
                    formControlName="wholesalePrice" /></label
                ><label
                  >Unidad<select formControlName="unitId">
                    <option value="">Selecciona</option>
                    @for (item of units(); track item.id) {
                      <option [value]="item.id">{{ item.name }}</option>
                    }
                  </select></label
                >
              </div>
              <div class="check-grid">
                <label
                  ><input type="checkbox" formControlName="publicVisible" /> Visible al
                  público</label
                ><label><input type="checkbox" formControlName="featured" /> Destacado</label
                ><label><input type="checkbox" formControlName="isNew" /> Nuevo</label
                ><label><input type="checkbox" formControlName="active" /> Activo</label>
              </div>
            </fieldset>
            <fieldset>
              <legend>5. Inventario visible</legend>
              <p class="hint">
                Las existencias son informativas; se cambiarán mediante movimientos cuando exista
                ese módulo.
              </p>
              <div class="form-grid">
                <label>Stock actual<input type="number" formControlName="stock" readonly /></label
                ><label
                  >Stock mínimo<input type="number" min="0" formControlName="minimumStock" /></label
                ><label
                  >Estado público<select formControlName="stockStatus">
                    <option value="disponible">Disponible</option>
                    <option value="pocas-unidades">Pocas unidades</option>
                    <option value="agotado">Agotado</option>
                    <option value="consultar">Consultar</option>
                  </select></label
                >
              </div>
            </fieldset>
            <fieldset>
              <legend>6. Confianza</legend>
              <div class="form-grid">
                <label>Garantía<textarea formControlName="warranty" rows="2"></textarea></label
                ><label>Procedencia<textarea formControlName="origin" rows="2"></textarea></label
                ><label>Cuidados<textarea formControlName="care" rows="2"></textarea></label
                ><label
                  >Política aplicable<textarea formControlName="policy" rows="2"></textarea>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>7. Multimedia</legend>
              <div formArrayName="images">
                @for (group of images.controls; track $index; let index = $index) {
                  <div class="repeat-row" [formGroupName]="index">
                    <label>URL<input formControlName="url" type="url" /></label
                    ><label>Texto alternativo<input formControlName="alt" /></label
                    ><label>Orden<input formControlName="order" type="number" min="0" /></label
                    ><label><input formControlName="primary" type="checkbox" /> Principal</label
                    ><button type="button" (click)="images.removeAt(index)">Quitar</button>
                  </div>
                }
              </div>
              <button type="button" (click)="addImage()">Agregar imagen</button>
            </fieldset>
            <fieldset>
              <legend>8. Especificaciones</legend>
              <div formArrayName="specifications">
                @for (group of specifications.controls; track $index; let index = $index) {
                  <div class="repeat-row" [formGroupName]="index">
                    <label>Etiqueta<input formControlName="label" /></label
                    ><label>Valor<input formControlName="value" /></label
                    ><label>Unidad<input formControlName="unit" /></label
                    ><button type="button" (click)="specifications.removeAt(index)">Quitar</button>
                  </div>
                }
              </div>
              <button type="button" (click)="addSpecification()">Agregar especificación</button>
            </fieldset>
            <fieldset>
              <legend>9. Variantes o presentaciones</legend>
              <div formArrayName="variants">
                @for (group of variants.controls; track $index; let index = $index) {
                  <div class="repeat-row" [formGroupName]="index">
                    <label>SKU<input formControlName="sku" /></label
                    ><label>Código<input formControlName="code" /></label
                    ><label
                      >Atributo<input formControlName="attribute" placeholder="Ej. Tamaño" /></label
                    ><label
                      >Valor<input
                        formControlName="attributeValue"
                        placeholder="Ej. 13 mm" /></label
                    ><label>Precio<input type="number" min="0" formControlName="price" /></label
                    ><label
                      >Stock informativo<input
                        type="number"
                        min="0"
                        formControlName="stock" /></label
                    ><button type="button" (click)="variants.removeAt(index)">Quitar</button>
                  </div>
                }
              </div>
              <button type="button" (click)="addVariant()">Agregar variante</button>
            </fieldset>
          </div>
          <aside class="panel product-preview">
            <h2>Vista previa</h2>
            <span class="eyebrow">{{ qualityLabel }}</span>
            <h3>{{ form.controls.name.value || 'Nombre del producto' }}</h3>
            <strong class="price">{{
              form.controls.price.value | currency: 'BOB' : 'symbol-narrow'
            }}</strong>
            <h4>¿Qué es?</h4>
            <p>{{ form.controls.description.value || 'Completa la descripción.' }}</p>
            <h4>¿Para qué sirve?</h4>
            <p>{{ form.controls.uses.value || 'Completa los usos.' }}</p>
            <h4>Contenido</h4>
            <p>{{ form.controls.packageContents.value || '—' }}</p>
            <h4>Garantía</h4>
            <p>{{ form.controls.warranty.value || 'Consultar' }}</p>
          </aside>
        </div>
        @if (error()) {
          <div class="alert danger" role="alert">{{ error() }}</div>
        }
        <div class="editor-actions">
          <a class="button secondary" routerLink="/admin/productos">Cancelar</a
          ><button class="button" [disabled]="saving()">
            {{ saving() ? 'Guardando…' : 'Guardar producto' }}
          </button>
        </div>
      </form>
    }
  </section>`,
})
export class ProductFormPage implements HasUnsavedChanges {
  private catalog = inject(CatalogService);
  private catalogs = inject(AdminCatalogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly productId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly loading = signal(!!this.productId);
  readonly saving = signal(false);
  readonly error = signal('');
  private saved = false;
  readonly categories = signal<AdminCatalogItem[]>([]);
  readonly subcategories = signal<AdminCatalogItem[]>([]);
  readonly brands = signal<AdminCatalogItem[]>([]);
  readonly units = signal<AdminCatalogItem[]>([]);
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    sku: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    barcode: new FormControl('', { nonNullable: true }),
    model: new FormControl('', { nonNullable: true }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)],
    }),
    categoryId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    subcategoryId: new FormControl('', { nonNullable: true }),
    brandId: new FormControl('', { nonNullable: true }),
    quality: new FormControl<Product['quality']>('ESTANDAR', { nonNullable: true }),
    summary: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(180)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    uses: new FormControl('', { nonNullable: true }),
    packageContents: new FormControl('', { nonNullable: true }),
    cost: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    wholesalePrice: new FormControl<number | null>(null),
    unitId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    publicVisible: new FormControl(true, { nonNullable: true }),
    featured: new FormControl(false, { nonNullable: true }),
    isNew: new FormControl(false, { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
    stock: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    minimumStock: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    stockStatus: new FormControl<Product['stockStatus']>('consultar', { nonNullable: true }),
    warranty: new FormControl('', { nonNullable: true }),
    origin: new FormControl('', { nonNullable: true }),
    care: new FormControl('', { nonNullable: true }),
    policy: new FormControl('', { nonNullable: true }),
    images: new FormArray<FormGroup>([]),
    specifications: new FormArray<FormGroup>([]),
    variants: new FormArray<FormGroup>([]),
  });
  get images() {
    return this.form.controls.images;
  }
  get specifications() {
    return this.form.controls.specifications;
  }
  get variants() {
    return this.form.controls.variants;
  }
  constructor() {
    forkJoin({
      categories: this.catalogs.all('categories'),
      subcategories: this.catalogs.all('subcategories'),
      brands: this.catalogs.all('brands'),
      units: this.catalogs.all('units'),
    }).subscribe((v) => {
      this.categories.set(v.categories);
      this.subcategories.set(v.subcategories);
      this.brands.set(v.brands);
      this.units.set(v.units);
    });
    this.form.controls.name.valueChanges.subscribe((name) => {
      if (!this.productId && !this.form.controls.slug.dirty)
        this.form.controls.slug.setValue(this.slugify(name));
    });
    if (this.productId)
      this.catalog
        .productById(this.productId)
        .subscribe((product) =>
          product
            ? this.populate(product)
            : (this.error.set('Producto no encontrado.'), this.loading.set(false)),
        );
  }
  get qualityLabel() {
    return { ECONOMICO: 'Económico', ESTANDAR: 'Estándar', PROFESIONAL: 'Profesional' }[
      this.form.controls.quality.value
    ];
  }
  addImage(value?: ProductImage) {
    this.images.push(
      new FormGroup({
        url: new FormControl(value?.url ?? '', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        alt: new FormControl(value?.alt ?? '', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        order: new FormControl(value?.order ?? this.images.length, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        primary: new FormControl(value?.primary ?? false, { nonNullable: true }),
      }),
    );
  }
  addSpecification(value?: Specification) {
    this.specifications.push(
      new FormGroup({
        label: new FormControl(value?.label ?? '', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        value: new FormControl(value?.value ?? '', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        unit: new FormControl(value?.unit ?? '', { nonNullable: true }),
      }),
    );
  }
  addVariant(value?: ProductVariant) {
    const entry = Object.entries(value?.attributes ?? {})[0] ?? ['', ''];
    this.variants.push(
      new FormGroup({
        sku: new FormControl(value?.sku ?? '', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        code: new FormControl(value?.code ?? '', { nonNullable: true }),
        attribute: new FormControl(entry[0], {
          nonNullable: true,
          validators: [Validators.required],
        }),
        attributeValue: new FormControl(entry[1], {
          nonNullable: true,
          validators: [Validators.required],
        }),
        price: new FormControl(value?.price ?? 0, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        stock: new FormControl(value?.stock ?? 0, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
      }),
    );
  }
  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.saved;
  }
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Revisa los campos obligatorios y los valores negativos.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const raw = this.form.getRawValue();
    this.catalog.slugAvailable(raw.slug, this.productId || undefined).subscribe((available) => {
      if (!available) {
        this.error.set('El slug ya pertenece a otro producto.');
        this.saving.set(false);
        return;
      }
      const images: ProductImage[] = raw.images.map((entry, index) => {
        const image = entry as { url: string; alt: string; order: number; primary: boolean };
        return { id: `img-${index}-${Date.now()}`, ...image };
      });
      const specifications: Specification[] = raw.specifications.map((entry) => {
        const specification = entry as { label: string; value: string; unit: string };
        return { ...specification, unit: specification.unit || undefined };
      });
      const variants: ProductVariant[] = raw.variants.map((entry, index) => {
        const variant = entry as {
          sku: string;
          code: string;
          attribute: string;
          attributeValue: string;
          price: number;
          stock: number;
        };
        return {
          id: `var-${index}-${Date.now()}`,
          sku: variant.sku,
          code: variant.code || undefined,
          attributes: { [variant.attribute]: variant.attributeValue },
          price: variant.price,
          stock: variant.stock,
        };
      });
      const product: Product = {
        id: this.productId || crypto.randomUUID(),
        name: raw.name.trim(),
        slug: raw.slug,
        active: raw.active,
        sku: raw.sku,
        barcode: raw.barcode || undefined,
        model: raw.model || undefined,
        categoryId: raw.categoryId,
        subcategoryId: raw.subcategoryId || undefined,
        brandId: raw.brandId || undefined,
        quality: raw.quality,
        summary: raw.summary,
        description: raw.description,
        uses: raw.uses,
        packageContents: raw.packageContents,
        cost: raw.cost,
        price: raw.price,
        wholesalePrice: raw.wholesalePrice ?? undefined,
        unitId: raw.unitId,
        publicVisible: raw.publicVisible,
        featured: raw.featured,
        isNew: raw.isNew,
        stock: raw.stock,
        minimumStock: raw.minimumStock,
        stockStatus: raw.stockStatus,
        warranty: raw.warranty || undefined,
        origin: raw.origin || undefined,
        care: [raw.care, raw.policy].filter(Boolean).join('\n') || undefined,
        images,
        specifications,
        variants,
        createdAt: new Date().toISOString(),
        keywords: raw.name.toLowerCase().split(/\s+/),
      };
      this.catalog.save(product).subscribe({
        next: () => {
          this.saved = true;
          this.router.navigateByUrl('/admin/productos');
        },
        error: () => {
          this.error.set('No se pudo guardar el producto.');
          this.saving.set(false);
        },
      });
    });
  }
  private populate(product: Product) {
    this.form.patchValue({
      ...product,
      barcode: product.barcode ?? '',
      model: product.model ?? '',
      subcategoryId: product.subcategoryId ?? '',
      brandId: product.brandId ?? '',
      wholesalePrice: product.wholesalePrice ?? null,
      warranty: product.warranty ?? '',
      origin: product.origin ?? '',
      care: product.care ?? '',
      policy: '',
    });
    for (const image of product.images) this.addImage(image);
    for (const spec of product.specifications) this.addSpecification(spec);
    for (const variant of product.variants) this.addVariant(variant);
    this.form.markAsPristine();
    this.loading.set(false);
  }
  private slugify(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
