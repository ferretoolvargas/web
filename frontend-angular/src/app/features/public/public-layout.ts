import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BRAND_INFO } from '../../core/config/brand.config';
import { ThemeService } from '../../core/services/theme.service';
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<a class="skip" href="#contenido">Saltar al contenido</a>
    <header class="public-header">
      <a routerLink="/" class="brand" aria-label="Ferretool Vargas, inicio">
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
        /> </a
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
        ><a routerLink="/contacto" routerLinkActive="active">Contacto</a
        ><a [href]="brand.whatsappUrl" target="_blank" rel="noopener noreferrer">WhatsApp</a
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
    </footer>`,
})
export class PublicLayout {
  readonly brand = BRAND_INFO;
  theme = inject(ThemeService);
  menu = signal(false);
}
