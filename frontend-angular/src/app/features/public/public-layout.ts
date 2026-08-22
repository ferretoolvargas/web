import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<a class="skip" href="#contenido">Saltar al contenido</a>
    <header class="public-header">
      <a routerLink="/" class="brand"
        ><span class="brand-mark">FV</span
        ><span>Ferretools Vargas<small>Herramientas para avanzar</small></span></a
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
        ><a href="https://wa.me/59160514138" target="_blank" rel="noopener">WhatsApp</a
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
      <strong>Ferretools Vargas</strong><span>Atención comercial: +591 60514138</span
      ><span>© 2026 · Bolivia</span>
    </footer>`,
})
export class PublicLayout {
  theme = inject(ThemeService);
  menu = signal(false);
}
