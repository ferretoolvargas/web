import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ProductImage, ProductVariant } from '../../core/models/domain.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductSharingService } from '../../core/services/product-sharing.service';
import { ProductCard, Spinner } from '../../shared/ui';

@Component({
  imports: [CurrencyPipe, RouterLink, ProductCard, Spinner],
  template: `<section class="page">
    @if (loading()) {
      <app-spinner />
    } @else if (!product()) {
      <div class="state not-found">
        <span class="eyebrow">Error 404</span>
        <h1>Producto no encontrado</h1>
        <p>El producto no existe, fue desactivado o el enlace cambió.</p>
        <div class="actions">
          <a class="button" routerLink="/catalogo">Explorar el catálogo</a
          ><a routerLink="/">Volver al inicio</a>
        </div>
      </div>
    } @else {
      <nav class="breadcrumbs" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a> / <a routerLink="/catalogo">Catálogo</a> /
        <span aria-current="page">{{ product()!.name }}</span>
      </nav>
      <div class="detail">
        <div class="gallery">
          @if (mainImage()) {
            <img
              class="detail-image"
              [src]="mainImage()!.url"
              [alt]="mainImage()!.alt"
              width="640"
              height="520"
            />
          } @else {
            <div
              class="detail-image fallback"
              role="img"
              [attr.aria-label]="'Imagen no disponible para ' + product()!.name"
            >
              🔧
            </div>
          }
          @if (product()!.images.length > 1) {
            <div class="thumbnails" aria-label="Galería de producto">
              @for (image of orderedImages; track image.id) {
                <button
                  (click)="mainImage.set(image)"
                  [class.active]="mainImage()?.id === image.id"
                  [attr.aria-label]="'Mostrar ' + image.alt"
                >
                  <img [src]="image.url" [alt]="image.alt" width="72" height="72" />
                </button>
              }
            </div>
          }
        </div>
        <article>
          <div class="badges">
            <span>{{ qualityLabel }}</span>
            @if (product()!.discountPercent) {
              <span>Oferta -{{ product()!.discountPercent }}%</span>
            }
            @if (product()!.isNew) {
              <span>Nuevo</span>
            }
          </div>
          <h1>{{ product()!.name }}</h1>
          @if (product()!.model) {
            <p>
              Modelo: <strong>{{ product()!.model }}</strong>
            </p>
          }
          <p class="lead">{{ product()!.summary }}</p>
          @if (currentPrice < product()!.price) {
            <del>{{
              product()!.price | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO'
            }}</del>
          }
          <strong class="detail-price">{{
            currentPrice | currency: 'BOB' : 'symbol-narrow' : '1.2-2' : 'es-BO'
          }}</strong>
          <p class="stock">{{ stockLabel }}</p>
          @if (product()!.variants.length) {
            <label class="variant-select"
              >Presentación<select (change)="selectVariant($any($event.target).value)">
                <option value="">Producto base</option>
                @for (variant of product()!.variants; track variant.id) {
                  <option [value]="variant.id">
                    {{ variantLabel(variant) }} · Bs {{ variant.price }}
                  </option>
                }
              </select></label
            >
          }
          <div class="actions">
            <a class="button" [href]="consultUrl" target="_blank" rel="noopener"
              >Consultar por WhatsApp</a
            ><a class="button secondary" [href]="shareUrl" target="_blank" rel="noopener"
              >Compartir por WhatsApp</a
            >
          </div>
        </article>
      </div>
      <div class="detail-content">
        <section>
          <h2>¿Qué es?</h2>
          <p>{{ product()!.description }}</p>
          <h2>¿Para qué sirve?</h2>
          <p>{{ product()!.uses }}</p>
          <h2>Características principales</h2>
          @if (product()!.specifications.length) {
            <ul>
              @for (spec of product()!.specifications; track spec.label) {
                <li>
                  <strong>{{ spec.label }}:</strong> {{ spec.value }} {{ spec.unit }}
                </li>
              }
            </ul>
          } @else {
            <p>Consulta las características disponibles con nuestro equipo.</p>
          }
          <h2>¿Para quién está recomendado?</h2>
          <p>{{ recommendation }}</p>
          <h2>Contenido del paquete</h2>
          <p>{{ product()!.packageContents }}</p>
        </section>
        <aside>
          <h2>Especificaciones</h2>
          @if (product()!.specifications.length) {
            <table>
              <tbody>
                @for (spec of product()!.specifications; track spec.label) {
                  <tr>
                    <th>{{ spec.label }}</th>
                    <td>{{ spec.value }} {{ spec.unit }}</td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <p>Sin especificaciones registradas.</p>
          }
          @if (product()!.warranty) {
            <h3>Garantía</h3>
            <p>{{ product()!.warranty }}</p>
          }
          @if (product()!.care) {
            <h3>Cuidados</h3>
            <p>{{ product()!.care }}</p>
          }
          @if (product()!.origin) {
            <h3>Procedencia</h3>
            <p>{{ product()!.origin }}</p>
          }
        </aside>
      </div>
      @if (related().length) {
        <section class="related">
          <div class="section-heading">
            <div>
              <span class="eyebrow">También puede servirte</span>
              <h2>Relacionados y alternativas</h2>
            </div>
            <a routerLink="/catalogo">Ver catálogo →</a>
          </div>
          <div class="product-grid">
            @for (item of related(); track item.id) {
              <app-product-card [product]="item" />
            }
          </div>
        </section>
      }
    }
  </section>`,
})
export class ProductDetailPage {
  private catalog = inject(CatalogService);
  private sharing = inject(ProductSharingService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  readonly product = signal<Product | undefined>(undefined);
  readonly related = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly mainImage = signal<ProductImage | undefined>(undefined);
  readonly selectedVariant = signal<ProductVariant | undefined>(undefined);
  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.title.setTitle('Ferretool Vargas | Herramientas para avanzar'),
    );
    this.catalog.product(this.route.snapshot.paramMap.get('slug') ?? '').subscribe((product) => {
      this.product.set(product);
      this.loading.set(false);
      if (product) {
        this.mainImage.set(this.ordered(product.images)[0]);
        this.updateMetadata(product);
        this.catalog.relatedProducts(product).subscribe((items) => this.related.set(items));
      } else this.title.setTitle('Producto no encontrado | Ferretool Vargas');
    });
  }
  get orderedImages() {
    return this.ordered(this.product()?.images ?? []);
  }
  get qualityLabel() {
    return { ECONOMICO: 'Esencial', ESTANDAR: 'Rendimiento', PROFESIONAL: 'Profesional' }[
      this.product()?.quality ?? 'ESTANDAR'
    ];
  }
  get stockLabel() {
    return this.product() ? this.sharing.stock(this.product()!) : '';
  }
  get currentPrice() {
    return (
      this.selectedVariant()?.price ?? this.product()?.effectivePrice ?? this.product()?.price ?? 0
    );
  }
  get canonical() {
    return this.document.location.href.split('?')[0].split('#')[0];
  }
  get consultUrl() {
    return this.product()
      ? this.sharing.consult(
          this.product()!,
          this.selectedVariant(),
          this.canonical,
          this.currentPrice,
        )
      : '#';
  }
  get shareUrl() {
    return this.product()
      ? this.sharing.share(this.product()!, this.qualityLabel, this.canonical, this.currentPrice)
      : '#';
  }
  get recommendation() {
    return {
      ECONOMICO: 'Para uso ocasional y cuando el presupuesto es la prioridad.',
      ESTANDAR: 'Para quien busca equilibrio entre precio, duración y frecuencia de uso.',
      PROFESIONAL: 'Para trabajo frecuente o intensivo que exige mayor resistencia.',
    }[this.product()?.quality ?? 'ESTANDAR'];
  }
  selectVariant(id: string) {
    this.selectedVariant.set(this.product()?.variants.find((item) => item.id === id));
  }
  variantLabel(variant: ProductVariant) {
    return Object.entries(variant.attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' · ');
  }
  private ordered(images: ProductImage[]) {
    return [...images].sort((a, b) => Number(b.primary) - Number(a.primary) || a.order - b.order);
  }
  private updateMetadata(product: Product) {
    const price = this.currentPrice.toFixed(2);
    const image = this.mainImage()?.url;
    this.title.setTitle(`${product.name} | Ferretool Vargas`);
    this.meta.updateTag({ name: 'description', content: product.summary });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    for (const [property, content] of [
      ['og:type', 'product'],
      ['og:title', product.name],
      ['og:description', product.summary],
      ['og:url', this.canonical],
      ['product:price:amount', price],
      ['product:price:currency', 'BOB'],
    ])
      this.meta.updateTag({ property, content });
    if (image)
      this.meta.updateTag({
        property: 'og:image',
        content: new URL(image, this.document.baseURI).href,
      });
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = this.canonical;
  }
}
