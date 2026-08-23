# 05 — Dashboard administrativo

## Objetivo

Crear un dashboard útil con datos simulados, evitando inventar lógica financiera definitiva.

## Contenido

- Ventas del día simuladas.
- Cantidad de productos activos.
- Productos con poco stock.
- Ofertas vigentes.
- Movimientos recientes simulados.
- Productos más consultados o vendidos, claramente etiquetados como datos mock durante desarrollo.
- Accesos rápidos a productos, categorías, marcas y promociones.

## Tareas

1. Modela la respuesta del dashboard como vendrá desde una futura API agregada.
2. Cárgala mediante servicio/repositorio; no hagas cálculos comerciales grandes en el componente.
3. Implementa estados loading, error, retry y empty.
4. Usa componentes accesibles, responsive y compatibles con dark/light.
5. Si usas gráficos, que aporten información y sean accesibles; no agregues una dependencia pesada solo por decoración.
6. Añade pruebas de carga exitosa, error y datos vacíos.

## Criterios de aceptación

- No hay métricas escritas directamente en HTML.
- El dashboard funciona con el contrato mock.
- Se visualiza correctamente en móvil sin tablas desbordadas.
- Los accesos rápidos usan rutas reales o quedan deshabilitados explícitamente hasta su fase.

