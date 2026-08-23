# 10 — Ofertas y promociones

## Objetivo

Administrar y mostrar ofertas/promociones sin mezclar ambos conceptos.

## Oferta

Se aplica a uno o varios productos con datos como:

- precio normal y promocional;
- porcentaje calculado de descuento;
- vigencia;
- estado;
- stock o límite promocional opcional;
- prioridad;
- productos asociados.

## Promoción

Es una campaña o condición comercial:

- nombre y slug;
- descripción clara;
- banner opcional;
- tipo: combo, descuento por categoría/marca, cantidad, regalo u otro extensible;
- condiciones;
- vigencia;
- productos/categorías/marcas asociados;
- prioridad y estado.

## Administración

- Listados paginados.
- Búsqueda y filtros por estado y vigencia.
- Crear, editar, activar/desactivar.
- Validar rangos de fechas y precios.
- Vista previa pública.
- Evitar promociones activas incoherentes o descuentos negativos.

## Área pública

- Página o sección de ofertas paginada.
- Banners/promociones vigentes únicamente.
- Precio anterior tachado de forma accesible y precio actual destacado.
- Condiciones visibles; no ocultarlas en texto difícil de encontrar.
- Productos vencidos vuelven a precio normal automáticamente según los datos mock y la fecha actual.

## Criterios de aceptación

- Oferta y promoción tienen modelos y UI diferenciados.
- Vigencia y estados se comportan de forma predecible.
- El catálogo y el detalle muestran el precio vigente correcto.
- Administración soporta paginación con 10, 25, 50 y 100.
- Área pública soporta 12, 24 y 48.
- Hay pruebas para vigencia, descuento y precio final.

