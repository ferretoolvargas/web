# Compartición de productos

Cada ficha usa `/productos/:slug` e incluye título, descripción, canonical y Open Graph en su HTML prerenderizado. Los mensajes de WhatsApp incluyen los datos comerciales y la URL pública codificada.

Angular genera durante el build una página estática para cada producto público presente en `public/mock-data/products.json`. Esto permite que crawlers y servicios sociales lean el contenido sin ejecutar JavaScript.

El sitemap se deriva de esas mismas semillas mediante `npm run seo:generate`. Antes de cada build, `npm run seo:check` comprueba que las rutas versionadas coincidan con los productos activos y visibles.

## Alcance y siguiente evolución

El prerender actual refleja las semillas versionadas. Los productos creados únicamente en `localStorage` no pueden aparecer en el sitemap ni generar una página durante el despliegue. Al conectar el backend se debe:

1. obtener los slugs públicos desde la API al compilar, o usar SSR;
2. regenerar el sitemap con esos mismos slugs;
3. disparar un nuevo despliegue cuando cambie el catálogo.

GitHub Pages sirve directamente las rutas prerenderizadas. `404.html` queda como recuperación para rutas de cliente que no existían durante el build.
