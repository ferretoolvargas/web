import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface CatalogItem {
  id: string;
  name: string;
  type: string;
  active: boolean;
}
@Component({
  imports: [FormsModule],
  template: `<section class="admin-page">
    <header class="page-heading">
      <span class="eyebrow">Configuración</span>
      <h1>Catálogos</h1>
      <p>Categorías, marcas, unidades y niveles de calidad.</p>
    </header>
    <div class="tabs" role="tablist">
      @for (tab of tabs; track tab) {
        <button (click)="selected.set(tab)" [class.active]="selected() === tab">{{ tab }}</button>
      }
    </div>
    <form class="inline-form" (ngSubmit)="add()">
      <label>Nuevo registro<input [(ngModel)]="newName" name="name" required /></label
      ><button class="button">Agregar</button>
    </form>
    <div class="panel">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          @for (item of filtered; track item.id) {
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.active ? 'Activo' : 'Inactivo' }}</td>
              <td>
                <button (click)="toggle(item)">{{ item.active ? 'Desactivar' : 'Activar' }}</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </section>`,
})
export class CatalogsPage {
  tabs = ['Categorías', 'Marcas', 'Unidades', 'Calidades'];
  selected = signal('Categorías');
  newName = '';
  items = signal<CatalogItem[]>([
    { id: '1', name: 'Herramientas eléctricas', type: 'Categorías', active: true },
    { id: '2', name: 'Construcción', type: 'Categorías', active: true },
    { id: '3', name: 'Unidad', type: 'Unidades', active: true },
    { id: '4', name: 'Estándar', type: 'Calidades', active: true },
  ]);
  get filtered() {
    return this.items().filter((i) => i.type === this.selected());
  }
  add() {
    const name = this.newName.trim();
    if (!name) return;
    if (
      this.items().some(
        (i) => i.type === this.selected() && i.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      alert('Ya existe un registro con ese nombre.');
      return;
    }
    this.items.update((v) => [
      ...v,
      { id: crypto.randomUUID(), name, type: this.selected(), active: true },
    ]);
    this.newName = '';
  }
  toggle(item: CatalogItem) {
    if (confirm(`¿Cambiar el estado de ${item.name}?`))
      this.items.update((v) => v.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i)));
  }
}
