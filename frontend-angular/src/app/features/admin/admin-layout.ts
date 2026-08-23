import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { MockDataService } from '../../core/services/mock-data.service';
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="admin-shell">
    <aside id="admin-navigation" [class.open]="menu()">
      <a routerLink="/admin" class="brand"
        ><span class="brand-mark">FV</span><span>Ferretools</span></a
      >
      <nav aria-label="Administración">
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Resumen</a
        ><a routerLink="/admin/productos" routerLinkActive="active">Productos</a
        ><a routerLink="/admin/catalogos" routerLinkActive="active">Catálogos</a
        ><a routerLink="/admin/promociones" routerLinkActive="active">Ofertas y promociones</a
        ><a routerLink="/" target="_blank">Ver tienda ↗</a>
        <button class="reset-data" (click)="resetMocks()">Restaurar datos de muestra</button>
      </nav>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <button
          class="menu"
          (click)="menu.update((v) => !v)"
          aria-controls="admin-navigation"
          [attr.aria-expanded]="menu()"
        >
          Menú</button
        ><span>{{ auth.session()?.user?.name }}</span
        ><button
          (click)="theme.toggle()"
          [attr.aria-label]="theme.dark() ? 'Usar tema claro' : 'Usar tema oscuro'"
        >
          {{ theme.dark() ? '☀️' : '🌙' }}</button
        ><button (click)="logout()">Cerrar sesión</button>
      </header>
      <main><router-outlet /></main>
    </div>
  </div>`,
})
export class AdminLayout {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private router = inject(Router);
  private mockData = inject(MockDataService);
  menu = signal(false);
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
  resetMocks() {
    if (!confirm('¿Restaurar productos, catálogos, ofertas y promociones de muestra?')) return;
    this.mockData.reset();
    globalThis.location.reload();
  }
}
