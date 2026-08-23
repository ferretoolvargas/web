# Estado de recursos y datos comerciales

Actualización: 2026-08-23.

## Recursos confirmados

Los seis logos oficiales están en `public/brand`: `ftv-dark.png`, `ftv-light.png`, `ftv-letras-dark.png`, `ftv-letras-light.png`, `ftv-letras-fh-dark.png` y `ftv-letras-fh-light.png`.

`foto-perfil.jpg` existe únicamente fuera del proyecto, en `/home/boris/Imágenes/ferretool/foto-perfil.jpg`. No se copió ni se utiliza porque todavía no está identificado ni autorizado.

## Fotografías de productos

No existen fotografías reales. Los SKU `FV-TAL-650`, `FV-LLA-012`, `FV-MED-005`, `FV-AMO-850`, `FV-MAR-016` y `FV-BRO-007` tienen `images: []` y muestran el placeholder accesible **Imagen no disponible**.

Cuando se reciban fotografías se guardarán en `public/products` usando `[sku]-principal.webp` y `[sku]-01.webp`, con sus rutas y textos alternativos en `products.json`.

## Información confirmada

- Nombre: Ferretool Vargas.
- Ubicación general: Mallasa, La Paz, Bolivia.
- WhatsApp: +591 60514138.
- Correo y enlaces oficiales de Instagram, TikTok y Facebook centralizados en `brand.config.ts`.

## Información pendiente

Dirección y referencia exactas, Google Maps, horarios, cobertura y costos de entrega, condiciones de recojo, métodos de pago, cambios, devoluciones, garantías, precios, existencias, marcas, modelos definitivos y fotografías por SKU.

Los precios, existencias, ofertas y promociones de los JSON son datos mock administrativos. `COMMERCIAL_STATUS` mantiene su publicación deshabilitada: el área pública muestra **Precio por consultar** y **Consultar disponibilidad**, no calcula descuentos públicos y dirige la confirmación a WhatsApp.
