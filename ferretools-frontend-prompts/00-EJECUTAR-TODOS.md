# Prompt maestro — Ejecutar todos los prompts del frontend

Actúa como responsable técnico del frontend de **Ferretools Vargas**. Estás situado en la raíz de un repositorio cuya estructura esperada es:

```text
frontend-angular/
backend-node/
README.md
```

Debes implementar solamente el frontend siguiendo, en orden estricto, los prompts numerados del `01` al `11` ubicados en esta misma carpeta.

## Forma de ejecución

1. Lee completamente este prompt y todos los prompts numerados antes de modificar archivos.
2. Inspecciona `AGENTS.md` y cualquier instrucción local aplicable.
3. Revisa el estado de Git y preserva todos los cambios preexistentes del usuario.
4. Ejecuta el prompt `01` y valida sus criterios de aceptación.
5. Continúa con el siguiente solamente si la fase anterior compila y sus pruebas relevantes pasan.
6. Después de cada fase, registra en tu respuesta de trabajo:
   - fase terminada;
   - archivos principales modificados;
   - comandos de validación ejecutados;
   - deuda o limitación detectada.
7. Si una fase falla, diagnostica y corrige dentro de su alcance. Si requiere una decisión funcional no definida o una acción destructiva, detente y pregunta.
8. No omitas fases ni declares éxito basándote únicamente en inspección visual del código.

## Restricciones globales

- Trabaja en `frontend-angular`.
- No modifiques `backend-node`.
- No reemplaces ni reinicialices un proyecto Angular existente.
- No actualices Angular ni dependencias principales salvo incompatibilidad demostrable y autorización del usuario.
- No borres código o estilos existentes sin comprobar que sean reemplazados funcionalmente.
- Respeta los logos, colores, tipografía y demás recursos del manual de identidad que ya existan en el repositorio. Si falta un valor visual esencial, crea tokens provisionales claramente identificados; no inventes un logo.
- Mantén áreas pública y administrativa dentro del mismo frontend, con layouts separados.
- Usa Angular moderno acorde con la versión instalada: componentes standalone cuando el proyecto ya siga ese enfoque, lazy loading, Signals donde aporten claridad, Reactive Forms, Router, HttpClient, guards e interceptors funcionales.
- Usa TypeScript estricto; evita `any`, duplicación y componentes monolíticos.
- Todo texto visible debe estar en español claro.
- Moneda: bolivianos, mostrada como `Bs`.
- Zona horaria comercial: `America/La_Paz` cuando sea relevante.
- WhatsApp: `+591 60514138`.

## Datos y futura API

- La fuente inicial es JSON/localStorage, pero los componentes nunca deben importar JSON directamente.
- Define modelos, DTOs de frontend, filtros, respuestas paginadas y contratos de repositorio.
- Centraliza `apiUrl`, `mockUrl` y `useMocks` en environments/configuración.
- Debe existir una implementación mock y quedar definida la implementación HTTP o el punto de sustitución limpio.
- Las operaciones CRUD simuladas deben persistir al recargar usando una capa de almacenamiento; no disperses `localStorage` por la aplicación.
- La paginación debe tener semántica de servidor: `page`, `limit`, `total`, `totalPages`, filtros y orden.

## Calidad de entrega

- Ejecuta como mínimo instalación reproducible si corresponde, formatter/lint disponible, pruebas relevantes y build de producción.
- No desactives validaciones para lograr que compile.
- Corrige errores y advertencias causados por tus cambios.
- Revisa responsive, teclado, foco, etiquetas, contraste y estados loading/error/empty.
- Al finalizar, entrega un resumen por fase, comandos ejecutados, resultado de pruebas y lista breve de decisiones que todavía necesita tomar el negocio.

Comienza ahora con `01-AUDITORIA-INICIAL.md`.

