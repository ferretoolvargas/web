# Compartición de productos

Cada ficha usa `/productos/:slug` y actualiza título, descripción y canonical. Los mensajes de WhatsApp incluyen los datos comerciales y la URL codificada.

WhatsApp suele leer el HTML inicial sin ejecutar JavaScript. Una SPA estática no garantiza una preview por producto aunque cambie etiquetas en el navegador. Producción debe usar SSR/prerender de Angular o un endpoint público que entregue HTML con Open Graph por slug. El hosting también debe redirigir rutas a `index.html`.
