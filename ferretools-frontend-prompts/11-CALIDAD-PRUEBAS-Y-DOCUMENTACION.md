# 11 — Calidad final, pruebas y documentación

## Objetivo

Cerrar esta primera etapa del frontend con una base estable, documentada y lista para conectar al backend.

## Revisión funcional

Verifica de extremo a extremo:

1. Inicio público.
2. Catálogo con búsqueda, filtros, orden y paginación.
3. Detalle por slug.
4. Compartir y consultar por WhatsApp.
5. Login y logout simulados.
6. Protección de rutas.
7. Dashboard.
8. CRUD de catálogos.
9. CRUD de productos, variantes, imágenes y especificaciones.
10. Ofertas y promociones.
11. Persistencia al recargar.
12. Dark/light.

## Revisión técnica

- Elimina imports y código muerto producido por estas fases.
- Corrige errores TypeScript, lint y tests.
- Revisa suscripciones, Signals y efectos para evitar fugas o ciclos.
- Verifica que ningún componente importe JSON.
- Verifica que `localStorage` esté encapsulado.
- Verifica que URLs/config no estén dispersas.
- Revisa lazy loading y tamaño de bundles; no agregues optimizaciones prematuras.
- Comprueba páginas directas y fallback de rutas según el hosting previsto.

## Accesibilidad y responsive

- Navegación completa por teclado.
- Foco visible.
- Etiquetas de formularios.
- Errores vinculados a campos.
- Modales con gestión correcta de foco.
- Contraste dark/light.
- Texto alternativo en imágenes.
- Tablas adaptables.
- Pruebas manuales en móvil, tablet y escritorio.

## Documentación

Actualiza `frontend-angular/README.md` o créalo si no existe, incluyendo:

- requisitos;
- instalación;
- comandos;
- estructura;
- rutas;
- usuarios mock de desarrollo sin credenciales reales;
- configuración `useMocks`, `mockUrl`, `apiUrl`;
- cómo restaurar semillas;
- cómo sustituir repositorios mock por HTTP;
- contratos paginados;
- decisiones de dark/light;
- limitaciones de SEO/previews sociales;
- siguiente etapa para NestJS.

Actualiza el `README.md` raíz solamente para enlazar la documentación del frontend y explicar cómo ejecutarlo. No cambies información del backend que no hayas verificado.

## Validación obligatoria

Ejecuta los comandos reales disponibles para:

- formato o verificación de formato;
- lint;
- tests;
- build de producción.

Si no existe alguno, documenta la ausencia; no inventes resultados.

## Entrega

Informa:

- resumen de funcionalidades;
- principales decisiones arquitectónicas;
- comandos y resultados;
- limitaciones reales;
- decisiones de negocio pendientes;
- contrato esperado para comenzar `backend-node`.

## Criterios de aceptación

- Build de producción exitoso.
- Tests configurados exitosos o fallas preexistentes claramente demostradas.
- No se modificó `backend-node`.
- El frontend funciona íntegramente con mocks.
- Cambiar a API requiere sustituir configuración/implementaciones, no reescribir componentes.

