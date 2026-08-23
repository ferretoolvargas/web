import { Component } from '@angular/core';
import { BRAND_INFO } from '../../core/config/brand.config';

@Component({
  template: `<section class="page contact-page">
    <header class="page-heading">
      <span class="eyebrow">Tienda y atención</span>
      <h1>Estamos para ayudarte</h1>
      <p class="lead">
        Visítanos en Mallasa o cuéntanos por WhatsApp qué trabajo necesitas realizar. Te ayudamos a
        elegir antes de comprar.
      </p>
    </header>

    <div class="contact-grid">
      <article class="contact-card contact-card-featured">
        <span class="contact-icon" aria-hidden="true">✦</span>
        <h2>Asesoramiento por WhatsApp</h2>
        <p>
          Consulta productos, compatibilidad y disponibilidad. Tú revisas el mensaje antes de
          enviarlo.
        </p>
        <a class="button" [href]="brand.whatsappUrl" target="_blank" rel="noopener noreferrer">
          Escribir al {{ brand.phoneDisplay }}
        </a>
      </article>

      <article class="contact-card">
        <span class="contact-icon" aria-hidden="true">⌖</span>
        <h2>Tienda física</h2>
        <p>
          <strong>{{ brand.location }}</strong>
        </p>
        <p>Coordinamos atención, entrega o recojo según disponibilidad.</p>
        <small>La dirección exacta y los horarios se publicarán cuando estén confirmados.</small>
      </article>

      <article class="contact-card">
        <span class="contact-icon" aria-hidden="true">@</span>
        <h2>Correo</h2>
        <p>Para consultas comerciales que necesiten más detalle.</p>
        <a [href]="'mailto:' + brand.email">{{ brand.email }}</a>
      </article>

      <article class="contact-card">
        <span class="contact-icon" aria-hidden="true">#</span>
        <h2>Síguenos</h2>
        <p>Consejos, productos, novedades y promociones.</p>
        <nav class="social-links" aria-label="Redes sociales">
          <a [href]="brand.instagramUrl" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a [href]="brand.tiktokUrl" target="_blank" rel="noopener noreferrer">TikTok</a>
          <a [href]="brand.facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a>
        </nav>
      </article>
    </div>

    <aside class="store-note">
      <strong>Compra con información clara.</strong>
      <span
        >No publicamos horarios, costos ni cobertura de entrega hasta contar con datos
        confirmados.</span
      >
    </aside>
  </section>`,
})
export class ContactPage {
  readonly brand = BRAND_INFO;
}
