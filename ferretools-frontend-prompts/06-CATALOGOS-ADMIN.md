# 06 — Catálogos administrativos

## Objetivo

Implementar patrones CRUD reutilizables para categorías, subcategorías, marcas, unidades de medida y niveles de calidad.

## Funciones

- Listado paginado.
- Búsqueda con debounce.
- Ordenamiento.
- Filtros relevantes.
- Crear.
- Editar.
- Ver detalle cuando aporte valor.
- Activar/desactivar con confirmación.
- Estados loading, error, empty y retry.
- Validación de duplicados simulada.

## Reglas

1. La paginación debe usar `page`, `limit`, `total` y `totalPages` del repositorio.
2. Permite tamaños 10, 25, 50 y 100 en administración.
3. Restablece correctamente la página cuando cambia búsqueda o filtro.
4. Conserva filtros en query params cuando sea razonable.
5. No dupliques cinco CRUD completos: extrae patrones compartidos sin caer en un componente genérico imposible de mantener.
6. Categorías soportan jerarquía o relación con subcategorías sin crear ciclos.
7. Marcas pueden incluir nombre, slug, descripción breve, logo opcional, sitio opcional y estado.
8. Unidades contemplan unidad, pieza, caja, paquete, metro, kilogramo, litro y rollo, ampliables.
9. Niveles visibles:
   - Económico: uso ocasional y presupuesto accesible.
   - Estándar: equilibrio entre precio y duración.
   - Profesional: uso frecuente o intensivo.
10. Nunca muestres “calidad baja”.

## Criterios de aceptación

- CRUD simulado persiste al recargar.
- Paginación, búsqueda y orden funcionan conjuntamente.
- Formularios tienen validaciones y foco en el primer error.
- Acciones destructivas requieren confirmación.
- Pruebas cubren al menos un flujo CRUD y el comportamiento paginado compartido.

