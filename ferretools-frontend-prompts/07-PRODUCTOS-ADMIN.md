# 07 — Administración de productos

## Objetivo

Implementar el módulo administrativo central de productos, preparado para un catálogo grande y una futura API.

## Listado

- Tabla paginada con 10, 25, 50 y 100 registros.
- Búsqueda por nombre, SKU, código de barras, modelo y palabras clave.
- Filtros por categoría, subcategoría, marca, nivel, disponibilidad, oferta, destacado y estado.
- Orden por nombre, precio, creación y stock.
- Columnas compactas y configurables solo si es sencillo.
- Acciones: ver, editar, activar/desactivar y administrar imágenes.

## Formulario

Organiza el formulario en secciones comprensibles:

1. Identificación: nombre, SKU, código de barras, modelo, slug.
2. Clasificación: categoría, subcategoría, marca y línea de calidad.
3. Contenido: resumen corto, descripción completa, usos recomendados y contenido del paquete.
4. Comercial: costo, precio, precio mayorista opcional, unidad de venta, visibilidad pública, destacado y nuevo.
5. Inventario visible: stock informativo, stock mínimo y estado público. No permitas editar existencias como si fuera un campo ordinario si aún no existe el módulo de movimientos.
6. Confianza: garantía, procedencia, cuidados y política aplicable.
7. Multimedia: imagen principal, galería con previsualización, orden y texto alternativo.
8. Especificaciones: pares tipados etiqueta/valor/unidad, adaptables por categoría.
9. Variantes/presentaciones: SKU, código, atributos, precio y stock informativo por variante.

## Descripción

- Ofrece campos estructurados, no una sola caja gigantesca.
- La vista previa debe mostrar “qué es”, “para qué sirve”, características, especificaciones, recomendación, contenido y garantía.
- Sanitiza cualquier HTML si se admite texto enriquecido.
- Define límites y contadores de caracteres razonables.

## Reglas

- Genera slug sugerido pero permite corregirlo; valida unicidad mock.
- No pierdas datos al navegar accidentalmente: advierte sobre cambios sin guardar.
- No simules existencias negativas.
- Formatea moneda en UI sin convertir precios a strings en el modelo.
- Usa servicios/repositorios, nunca JSON directo.

## Criterios de aceptación

- Lista paginada y filtrada funciona con muchos datos mock.
- Crear/editar persiste y se refleja en el catálogo público futuro.
- El formulario es usable en móvil y accesible.
- Variantes y especificaciones pueden agregarse/quitarse sin romper validación.
- Hay pruebas del formulario y del listado.

