import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import products from '../../public/mock-data/products.json';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'productos/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return products
        .filter((product) => product.active && product.publicVisible)
        .map((product) => ({ slug: product.slug }));
    },
  },
  {
    path: 'admin/login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
