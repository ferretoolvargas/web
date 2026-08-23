import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Offer, Promotion, PromotionType } from '../../core/models/domain.models';
import { CampaignService } from '../../core/services/campaign.service';
import { EmptyState } from '../../shared/ui';

@Component({
  imports: [DatePipe, ReactiveFormsModule, EmptyState],
  template: `<section class="admin-page">
    <header class="page-heading">
      <span class="eyebrow">Campañas comerciales</span>
      <h1>Ofertas y promociones</h1>
      <p>
        Los precios especiales de producto y las condiciones comerciales se administran por
        separado.
      </p>
    </header>
    <div class="tabs" role="tablist">
      <button [class.active]="tab() === 'offers'" (click)="select('offers')">
        Ofertas de producto</button
      ><button [class.active]="tab() === 'promotions'" (click)="select('promotions')">
        Promociones
      </button>
    </div>
    <div class="toolbar">
      <label>Buscar<input [formControl]="search" (keyup.enter)="load()" /></label
      ><label
        >Estado<select [formControl]="status" (change)="changed()">
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select></label
      ><label
        >Vigencia<select [formControl]="validity" (change)="changed()">
          <option value="">Todas</option>
          <option value="current">Vigentes</option>
          <option value="expired">Vencidas</option>
        </select></label
      ><label
        >Por página<select [formControl]="limit" (change)="changed()">
          <option [ngValue]="10">10</option>
          <option [ngValue]="25">25</option>
          <option [ngValue]="50">50</option>
          <option [ngValue]="100">100</option>
        </select></label
      ><button (click)="load()">Buscar</button>
    </div>
    <div class="catalog-admin-grid">
      <div>
        @if (tab() === 'offers') {
          @if (!offers().length) {
            <app-empty title="Sin ofertas" />
          } @else {
            <div class="table-wrap panel">
              <table>
                <thead>
                  <tr>
                    <th>Oferta</th>
                    <th>Precios</th>
                    <th>Descuento</th>
                    <th>Vigencia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of offers(); track item.id) {
                    <tr>
                      <td>
                        <strong>{{ item.name }}</strong
                        ><small>{{ item.conditions }}</small>
                      </td>
                      <td>
                        <del>Bs {{ item.normalPrice }}</del
                        ><strong> Bs {{ item.promotionalPrice }}</strong>
                      </td>
                      <td>{{ campaigns.discount(item) }}%</td>
                      <td>
                        {{ item.startsAt | date: 'dd/MM/yyyy' }} –
                        {{ item.endsAt | date: 'dd/MM/yyyy' }}
                      </td>
                      <td>{{ statusLabel(item) }}</td>
                      <td class="table-actions">
                        <button (click)="editOffer(item)">Editar</button
                        ><button (click)="toggleOffer(item)">
                          {{ item.active ? 'Desactivar' : 'Activar' }}
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        } @else {
          @if (!promotions().length) {
            <app-empty title="Sin promociones" />
          } @else {
            <div class="table-wrap panel">
              <table>
                <thead>
                  <tr>
                    <th>Promoción</th>
                    <th>Tipo</th>
                    <th>Condiciones</th>
                    <th>Vigencia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of promotions(); track item.id) {
                    <tr>
                      <td>
                        <strong>{{ item.name }}</strong
                        ><small>{{ item.description }}</small>
                      </td>
                      <td>{{ item.type }}</td>
                      <td>{{ item.conditions }}</td>
                      <td>
                        {{ item.startsAt | date: 'dd/MM/yyyy' }} –
                        {{ item.endsAt | date: 'dd/MM/yyyy' }}
                      </td>
                      <td>{{ statusLabel(item) }}</td>
                      <td class="table-actions">
                        <button (click)="editPromotion(item)">Editar</button
                        ><button (click)="togglePromotion(item)">
                          {{ item.active ? 'Desactivar' : 'Activar' }}
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }
        <nav class="pagination">
          <button [disabled]="page() === 1" (click)="go(-1)">Anterior</button
          ><span>Página {{ page() }} de {{ pages() }}</span
          ><button [disabled]="page() === pages()" (click)="go(1)">Siguiente</button>
        </nav>
      </div>
      @if (tab() === 'offers') {
        <form class="panel catalog-form" [formGroup]="offerForm" (ngSubmit)="saveOffer()">
          <h2>{{ editing() ? 'Editar' : 'Nueva' }} oferta</h2>
          <label>Nombre<input formControlName="name" /></label
          ><label>Slug<input formControlName="slug" /></label
          ><label
            >IDs de productos, separados por coma<input
              formControlName="productIds"
              placeholder="p1, p2"
          /></label>
          <div class="form-grid">
            <label>Precio normal<input type="number" min="0" formControlName="normalPrice" /></label
            ><label
              >Precio promocional<input
                type="number"
                min="0"
                formControlName="promotionalPrice" /></label
            ><label>Inicio<input type="datetime-local" formControlName="startsAt" /></label
            ><label>Final<input type="datetime-local" formControlName="endsAt" /></label
            ><label>Prioridad<input type="number" min="0" formControlName="priority" /></label
            ><label>Límite opcional<input type="number" min="0" formControlName="limit" /></label>
          </div>
          <label
            >Condiciones visibles<textarea formControlName="conditions" rows="3"></textarea></label
          ><label class="check-filter"
            ><input type="checkbox" formControlName="active" /> Activa</label
          >
          @if (error()) {
            <div class="alert danger">{{ error() }}</div>
          }
          <button class="button">Guardar oferta</button>
        </form>
      } @else {
        <form class="panel catalog-form" [formGroup]="promotionForm" (ngSubmit)="savePromotion()">
          <h2>{{ editing() ? 'Editar' : 'Nueva' }} promoción</h2>
          <label>Nombre<input formControlName="name" /></label
          ><label>Slug<input formControlName="slug" /></label
          ><label>Descripción<textarea formControlName="description" rows="3"></textarea></label
          ><label
            >Tipo<select formControlName="type">
              <option value="combo">Combo</option>
              <option value="categoria">Categoría</option>
              <option value="marca">Marca</option>
              <option value="cantidad">Cantidad</option>
              <option value="regalo">Regalo</option>
              <option value="otro">Otro</option>
            </select></label
          ><label
            >Condiciones visibles<textarea formControlName="conditions" rows="3"></textarea>
          </label>
          <div class="form-grid">
            <label>Inicio<input type="datetime-local" formControlName="startsAt" /></label
            ><label>Final<input type="datetime-local" formControlName="endsAt" /></label
            ><label>Prioridad<input type="number" min="0" formControlName="priority" /></label>
          </div>
          <label>IDs productos<input formControlName="productIds" /></label
          ><label>IDs categorías<input formControlName="categoryIds" /></label
          ><label>IDs marcas<input formControlName="brandIds" /></label
          ><label class="check-filter"
            ><input type="checkbox" formControlName="active" /> Activa</label
          >
          @if (error()) {
            <div class="alert danger">{{ error() }}</div>
          }
          <div class="campaign-preview">
            <strong>{{ promotionForm.controls.name.value || 'Vista previa' }}</strong>
            <p>{{ promotionForm.controls.description.value }}</p>
            <small>{{ promotionForm.controls.conditions.value }}</small>
          </div>
          <button class="button">Guardar promoción</button>
        </form>
      }
    </div>
  </section>`,
})
export class PromotionsPage {
  readonly campaigns = inject(CampaignService);
  readonly tab = signal<'offers' | 'promotions'>('offers');
  readonly offers = signal<Offer[]>([]);
  readonly promotions = signal<Promotion[]>([]);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly editing = signal('');
  readonly error = signal('');
  readonly search = new FormControl('', { nonNullable: true });
  readonly status = new FormControl('', { nonNullable: true });
  readonly validity = new FormControl('', { nonNullable: true });
  readonly limit = new FormControl(10, { nonNullable: true });
  readonly offerForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    slug: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    productIds: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    normalPrice: new FormControl(0, { nonNullable: true, validators: [Validators.min(0.01)] }),
    promotionalPrice: new FormControl(0, { nonNullable: true, validators: [Validators.min(0.01)] }),
    startsAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endsAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    limit: new FormControl<number | null>(null),
    conditions: new FormControl('', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });
  readonly promotionForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    slug: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<PromotionType>('combo', { nonNullable: true }),
    conditions: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startsAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endsAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    priority: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    productIds: new FormControl('', { nonNullable: true }),
    categoryIds: new FormControl('', { nonNullable: true }),
    brandIds: new FormControl('', { nonNullable: true }),
    active: new FormControl(true, { nonNullable: true }),
  });
  constructor() {
    this.load();
  }
  select(tab: 'offers' | 'promotions') {
    this.tab.set(tab);
    this.page.set(1);
    this.editing.set('');
    this.error.set('');
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
    const query = {
      page: this.page(),
      limit: this.limit.value,
      search: this.search.value,
      filters: { active: this.status.value, validity: this.validity.value },
    };
    if (this.tab() === 'offers')
      this.campaigns.listOffers(query).subscribe((response) => {
        this.offers.set(response.data);
        this.page.set(response.meta.page);
        this.pages.set(response.meta.totalPages);
      });
    else
      this.campaigns.listPromotions(query).subscribe((response) => {
        this.promotions.set(response.data);
        this.page.set(response.meta.page);
        this.pages.set(response.meta.totalPages);
      });
  }
  statusLabel(item: Offer | Promotion) {
    return this.campaigns.isCurrent(item)
      ? 'Vigente'
      : item.active && Date.parse(item.endsAt) < Date.now()
        ? 'Vencida'
        : item.active
          ? 'Programada'
          : 'Inactiva';
  }
  saveOffer() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }
    const value = this.offerForm.getRawValue();
    const item: Offer = {
      id: this.editing() || crypto.randomUUID(),
      name: value.name,
      slug: value.slug,
      productIds: this.ids(value.productIds),
      normalPrice: value.normalPrice,
      promotionalPrice: value.promotionalPrice,
      startsAt: new Date(value.startsAt).toISOString(),
      endsAt: new Date(value.endsAt).toISOString(),
      priority: value.priority,
      limit: value.limit ?? undefined,
      conditions: value.conditions,
      active: value.active,
    };
    this.campaigns.saveOffer(item).subscribe({
      next: () => {
        this.resetOffer();
        this.load();
      },
      error: (error) => this.error.set(error.message),
    });
  }
  savePromotion() {
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }
    const value = this.promotionForm.getRawValue();
    const item: Promotion = {
      id: this.editing() || crypto.randomUUID(),
      name: value.name,
      slug: value.slug,
      description: value.description,
      type: value.type,
      conditions: value.conditions,
      startsAt: new Date(value.startsAt).toISOString(),
      endsAt: new Date(value.endsAt).toISOString(),
      productIds: this.ids(value.productIds),
      categoryIds: this.ids(value.categoryIds),
      brandIds: this.ids(value.brandIds),
      priority: value.priority,
      active: value.active,
    };
    this.campaigns.savePromotion(item).subscribe({
      next: () => {
        this.resetPromotion();
        this.load();
      },
      error: (error) => this.error.set(error.message),
    });
  }
  editOffer(item: Offer) {
    this.editing.set(item.id);
    this.offerForm.patchValue({
      ...item,
      productIds: item.productIds.join(', '),
      startsAt: this.localDate(item.startsAt),
      endsAt: this.localDate(item.endsAt),
    });
  }
  editPromotion(item: Promotion) {
    this.editing.set(item.id);
    this.promotionForm.patchValue({
      ...item,
      productIds: item.productIds.join(', '),
      categoryIds: item.categoryIds.join(', '),
      brandIds: item.brandIds.join(', '),
      startsAt: this.localDate(item.startsAt),
      endsAt: this.localDate(item.endsAt),
    });
  }
  toggleOffer(item: Offer) {
    if (confirm(`¿Cambiar estado de ${item.name}?`))
      this.campaigns.toggleOffer(item.id).subscribe(() => this.load());
  }
  togglePromotion(item: Promotion) {
    if (confirm(`¿Cambiar estado de ${item.name}?`))
      this.campaigns.togglePromotion(item.id).subscribe(() => this.load());
  }
  private resetOffer() {
    this.editing.set('');
    this.error.set('');
    this.offerForm.reset({
      name: '',
      slug: '',
      productIds: '',
      normalPrice: 0,
      promotionalPrice: 0,
      startsAt: '',
      endsAt: '',
      priority: 0,
      limit: null,
      conditions: '',
      active: true,
    });
  }
  private resetPromotion() {
    this.editing.set('');
    this.error.set('');
    this.promotionForm.reset({
      name: '',
      slug: '',
      description: '',
      type: 'combo',
      conditions: '',
      startsAt: '',
      endsAt: '',
      priority: 0,
      productIds: '',
      categoryIds: '',
      brandIds: '',
      active: true,
    });
  }
  private ids(value: string) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  private localDate(value: string) {
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
