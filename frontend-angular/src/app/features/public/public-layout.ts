import { Component, HostListener, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BRAND_INFO } from '../../core/config/brand.config';
import { ThemeService } from '../../core/services/theme.service';
import { Icon } from '../../shared/ui';
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, Icon],
  template: `<a class="skip" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="header-main">
        <a routerLink="/" class="brand" aria-label="Ferretool Vargas, inicio" (click)="closeMenu()">
          <img
            class="brand-logo"
            [src]="theme.dark() ? 'brand/ftv-letras-dark.png' : 'brand/ftv-letras-light.png'"
            alt="Ferretool"
            width="520"
            height="236"
          />
          <img
            class="brand-symbol"
            [src]="theme.dark() ? 'brand/ftv-dark.png' : 'brand/ftv-light.png'"
            alt=""
            width="128"
            height="45"
          />
        </a>
        <form class="header-search" role="search" (submit)="search($event)">
          <label class="sr-only" for="site-search">Buscar en todo el sitio</label>
          <input
            id="site-search"
            type="search"
            [formControl]="query"
            placeholder="Buscar productos, herramientas y más..."
          />
          <button type="submit" aria-label="Buscar"><app-icon name="search" /></button>
        </form>
        <div class="header-actions" aria-label="Acciones rápidas">
          <button class="icon-button optional-action" type="button" aria-label="Mi cuenta" disabled>
            <app-icon name="user" />
          </button>
          <button class="icon-button optional-action" type="button" aria-label="Favoritos" disabled>
            <app-icon name="heart" />
          </button>
          <button class="icon-button optional-action" type="button" aria-label="Carrito" disabled>
            <app-icon name="cart" />
          </button>
          <button
            class="theme-toggle"
            type="button"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.dark() ? 'Usar tema claro' : 'Usar tema oscuro'"
          >
            <app-icon [name]="theme.dark() ? 'sun' : 'moon'" />
          </button>
          <button
            class="menu"
            type="button"
            aria-label="Menú"
            (click)="menu.set(true)"
            aria-controls="public-navigation"
            [attr.aria-expanded]="menu()"
          >
            <app-icon name="menu" /><span>Menú</span>
          </button>
        </div>
      </div>
      <nav class="desktop-nav" aria-label="Principal">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Inicio</a
        ><a routerLink="/catalogo" routerLinkActive="active">Catálogo</a
        ><a routerLink="/ofertas" routerLinkActive="active">Ofertas</a
        ><a routerLink="/contacto" routerLinkActive="active">Contacto</a
        ><a [href]="brand.whatsappUrl" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </nav>
    </header>
    @if (menu()) {
      <button class="nav-overlay" aria-label="Cerrar menú" (click)="closeMenu()"></button>
    }
    <nav
      id="public-navigation"
      class="mobile-nav"
      [class.open]="menu()"
      [attr.aria-hidden]="!menu()"
      aria-label="Menú móvil"
    >
      <div class="mobile-nav-head">
        <strong>Menú</strong
        ><button class="icon-button" type="button" (click)="closeMenu()" aria-label="Cerrar menú">
          <app-icon name="close" />
        </button>
      </div>
      <a routerLink="/" (click)="closeMenu()">Inicio</a
      ><a routerLink="/catalogo" (click)="closeMenu()">Catálogo</a
      ><a routerLink="/ofertas" (click)="closeMenu()">Ofertas</a
      ><a routerLink="/contacto" (click)="closeMenu()">Contacto</a>
      <a [href]="brand.whatsappUrl" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <button class="mobile-theme" type="button" (click)="theme.toggle()">
        <app-icon [name]="theme.dark() ? 'sun' : 'moon'" />
        {{ theme.dark() ? 'Usar tema claro' : 'Usar tema oscuro' }}
      </button>
    </nav>
    <main id="contenido" class="public-main"><router-outlet /></main>
    <footer>
      <div>
        <strong>{{ brand.name }}</strong
        ><span>{{ brand.location }}</span>
      </div>
      <nav aria-label="Contacto y redes">
        <a routerLink="/contacto">Contacto</a>
        <a [href]="brand.instagramUrl" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a [href]="brand.facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a>
      </nav>
      <span>© 2026 · Bolivia</span>
    </footer>
    <nav class="app-tabbar" aria-label="Navegación móvil">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
        ><app-icon name="home" /><span>Inicio</span></a
      >
      <a routerLink="/catalogo" routerLinkActive="active"
        ><app-icon name="grid" /><span>Catálogo</span></a
      >
      <a routerLink="/ofertas" routerLinkActive="active"
        ><app-icon name="tag" /><span>Ofertas</span></a
      >
      <a routerLink="/contacto" routerLinkActive="active"
        ><app-icon name="message" /><span>Contacto</span></a
      >
      <button type="button" (click)="menu.set(true)" aria-label="Abrir más opciones">
        <app-icon name="more" /><span>Más</span>
      </button>
    </nav>`,
})
export class PublicLayout {
  readonly brand = BRAND_INFO;
  theme = inject(ThemeService);
  menu = signal(false);
  query = new FormControl('', { nonNullable: true });
  private router = inject(Router);
  search(event: Event) {
    event.preventDefault();
    const q = this.query.value.trim();
    this.router.navigate(['/catalogo'], { queryParams: { q: q || null } });
  }
  closeMenu() {
    this.menu.set(false);
  }
  @HostListener('document:keydown.escape') onEscape() {
    this.closeMenu();
  }
}
