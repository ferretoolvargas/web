# Compartición de productos

Cada ficha usa `/productos/:slug` y actualiza título, descripción y canonical. Los mensajes de WhatsApp incluyen los datos comerciales y la URL codificada.

WhatsApp suele leer el HTML inicial sin ejecutar JavaScript. Una SPA estática no garantiza una preview por producto aunque cambie etiquetas en el navegador. Las etiquetas dinámicas actuales mejoran navegador y accesibilidad, pero no se presentan como una solución de crawler.

## Estrategia para producción

Debe elegirse una de estas opciones al definir el hosting:

1. Angular SSR, resolviendo el producto antes de renderizar el HTML.
2. Prerender de cada slug durante el despliegue, regenerado cuando cambie el catálogo.
3. Endpoint público o función edge que entregue HTML con Open Graph y redirija al frontend.

El servidor debe responder las rutas directas mediante SSR/prerender o redirigirlas a `index.html`. GitHub Pages usa actualmente un `404.html` equivalente al build para recuperar rutas de la SPA, pero esa solución no genera previews sociales por producto.
