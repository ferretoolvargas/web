import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Offer } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
@Component({
  imports: [DatePipe],
  template: `<section class="admin-page">
    <header class="section-heading">
      <div>
        <span class="eyebrow">Campañas comerciales</span>
        <h1>Ofertas y promociones</h1>
      </div>
      <button class="button" (click)="message.set('Formulario pendiente de definición comercial.')">
        Nueva campaña
      </button>
    </header>
    @if (message()) {
      <div class="alert">{{ message() }} <button (click)="message.set('')">Cerrar</button></div>
    }
    <div class="panel">
      <h2>Ofertas de producto</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Vigencia</th>
            <th>Precio promocional</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          @for (o of offers(); track o.id) {
            <tr>
              <td>{{ o.name }}</td>
              <td>{{ o.startsAt | date: 'dd/MM/yyyy' }} – {{ o.endsAt | date: 'dd/MM/yyyy' }}</td>
              <td>Bs {{ o.promotionalPrice }}</td>
              <td>{{ o.active ? 'Activa' : 'Inactiva' }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4">No hay ofertas.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div class="panel">
      <h2>Promociones</h2>
      <p>
        Las promociones se administrarán como campañas separadas de los precios especiales de
        producto.
      </p>
    </div>
  </section>`,
})
export class PromotionsPage {
  private catalog = inject(CatalogService);
  offers = signal<Offer[]>([]);
  message = signal('');
  constructor() {
    this.catalog.offers().subscribe((v) => this.offers.set(v));
  }
}
