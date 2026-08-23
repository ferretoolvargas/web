import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<a class="skip" href="#contenido">Saltar al contenido</a>
    <header class="public-header">
      <a routerLink="/" class="brand" aria-label="Ferretool Vargas, inicio">
        <img class="brand-logo brand-logo-light" src="brand/ftv-letras-light.png" alt="Ferretool" />
        <img class="brand-logo brand-logo-dark" src="brand/ftv-letras-dark.png" alt="Ferretool" />
        <img class="brand-symbol brand-logo-light" src="brand/ftv-light.png" alt="Ferretool" />
        <img class="brand-symbol brand-logo-dark" src="brand/ftv-dark.png" alt="Ferretool" /> </a
      ><button
        class="menu"
        (click)="menu.update((v) => !v)"
        aria-controls="public-navigation"
        [attr.aria-expanded]="menu()"
      >
        Menú
      </button>
      <nav id="public-navigation" [class.open]="menu()" aria-label="Principal">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Inicio</a
        ><a routerLink="/catalogo" routerLinkActive="active">Catálogo</a
        ><a routerLink="/ofertas" routerLinkActive="active">Ofertas</a
        ><a href="https://wa.me/59160514138" target="_blank" rel="noopener noreferrer">WhatsApp</a
        ><button
          (click)="theme.toggle()"
          [attr.aria-label]="theme.dark() ? 'Usar tema claro' : 'Usar tema oscuro'"
        >
          {{ theme.dark() ? '☀️' : '🌙' }}
        </button>
      </nav>
    </header>
    <main id="contenido"><router-outlet /></main>
    <footer>
      <strong>Ferretool Vargas</strong><span>Mallasa, La Paz · Atención: +591 60514138</span
      ><span>© 2026 · Bolivia</span>
    </footer>`,
})
export class PublicLayout {
  theme = inject(ThemeService);
  menu = signal(false);
}
