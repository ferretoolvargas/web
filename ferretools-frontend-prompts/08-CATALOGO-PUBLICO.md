# 08 — Catálogo público

## Objetivo

Construir una experiencia pública clara para descubrir productos sin iniciar sesión.

## Rutas y contenido

- `/`: presentación breve, categorías, ofertas, productos destacados/nuevos y contacto.
- `/catalogo`: catálogo paginado.
- Rutas por categoría o filtros mediante query params cuando corresponda.

## Catálogo

- Búsqueda por texto con debounce.
- Filtros por categoría, subcategoría, marca, calidad, rango de precio, disponibilidad y oferta.
- Orden: relevancia, menor precio, mayor precio, nuevos y mayor descuento.
- Paginación de 12, 24 y 48 productos.
- En móvil, filtros en panel accesible sin bloquear navegación.
- Las tarjetas muestran:
  - imagen optimizada y fallback;
  - nombre;
  - marca/modelo cuando exista;
  - línea Económico, Estándar o Profesional;
  - precio normal/promocional;
  - estado de disponibilidad;
  - indicador oferta/nuevo/destacado cuando corresponda;
  - enlace semántico al detalle.

## Reglas

- No mostrar stock exacto al público; usa estados comerciales.
- Un agotado permanece visible y permite conocer alternativas.
- Conserva búsqueda, filtros, orden y página en la URL.
- Si una página queda fuera de rango al cambiar filtros, vuelve a la primera página.
- No cargues todos los productos dentro del componente para paginar visualmente; usa el repositorio paginado.
- Asegura jerarquía visual simple, contraste, teclado y lectores de pantalla.

## Criterios de aceptación

- Un usuario entiende qué se vende y cómo buscar en pocos segundos.
- Filtros, orden, paginación y URL permanecen sincronizados.
- Las tarjetas enlazan a slugs reales.
- Hay loading skeleton, error, retry y empty state.
- Se prueba en anchos móvil, tablet y escritorio.

