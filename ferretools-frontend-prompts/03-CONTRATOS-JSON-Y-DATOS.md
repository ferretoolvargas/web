# 03 — Contratos, JSON, repositorios y persistencia simulada

## Objetivo

Construir una capa de datos mock que se pueda sustituir por la API NestJS sin reescribir componentes.

## Tareas

1. Crea configuración central con valores equivalentes a:
   - `useMocks`;
   - `apiUrl`;
   - `mockUrl`.
2. Define contratos generales:
   - `ApiResponse<T>`;
   - `PaginatedResponse<T>`;
   - `PaginationMeta`;
   - `QueryParams` con `page`, `limit`, `search`, `sortBy`, `sortOrder` y filtros;
   - error de validación compatible con una futura API REST.
3. Define modelos mínimos para usuario, categoría, subcategoría, marca, unidad, nivel de calidad, producto, variante, imagen, oferta y promoción.
4. Usa nombres consistentes y documenta el mapeo esperado a la API. No uses `any`.
5. Crea contratos de repositorio por dominio o una abstracción equivalente.
6. Implementa repositorios mock que:
   - carguen semillas desde `public/mock-data/*.json`;
   - persistan cambios simulados mediante un único servicio de almacenamiento;
   - permitan restaurar semillas para desarrollo;
   - simulen latencia de forma configurable, sin ralentizar tests;
   - soporten paginación, búsqueda, filtros y orden con semántica de servidor.
7. Prepara repositorios HTTP o factories/tokens de inyección que permitan cambiar de mock a API con configuración, sin modificar componentes.
8. Incluye datos de muestra realistas de ferretería en español, sin marcas registradas inventadas como si fueran oficiales y sin lorem ipsum.
9. Crea pruebas unitarias para paginación, filtros, persistencia y cambio de fuente.

## Reglas de producto

- Niveles públicos: `ECONOMICO`, `ESTANDAR`, `PROFESIONAL`.
- Estados públicos de stock: disponible, pocas unidades, agotado y consultar.
- Precios numéricos; el formateo `Bs` corresponde a presentación.
- El slug debe ser estable y apto para URL.
- La descripción debe separar resumen comercial, descripción completa y especificaciones.

## Criterios de aceptación

- Ningún componente importa JSON directamente.
- `localStorage` o su alternativa está encapsulado en un solo punto.
- Los mocks devuelven el mismo tipo de respuesta esperado de la API.
- La paginación no depende de cargar datos dentro del componente.
- Las pruebas cubren los contratos esenciales.

