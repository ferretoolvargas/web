# 01 — Auditoría inicial del frontend

## Objetivo

Comprender el estado real de `frontend-angular` antes de implementar cambios y dejar una base de decisiones verificable.

## Tareas

1. Confirma la estructura de la raíz y que existen `frontend-angular`, `backend-node` y `README.md`.
2. Lee las instrucciones locales aplicables (`AGENTS.md`, README y equivalentes).
3. Inspecciona el estado de Git. No alteres cambios existentes del usuario.
4. Dentro de `frontend-angular`, identifica:
   - versión de Angular, Node esperada y gestor de paquetes;
   - standalone o NgModules;
   - Tailwind y estrategia CSS;
   - rutas existentes;
   - estructura actual de componentes;
   - configuración de tests, lint y formatter;
   - assets de identidad: logos dark/light, favicon, colores y fuentes;
   - pantallas o código reutilizable;
   - deuda técnica y errores actuales.
5. Ejecuta los comandos de validación existentes sin modificar aún la arquitectura: build, tests y lint, únicamente si están configurados.
6. Crea `frontend-angular/docs/frontend-audit.md` con:
   - inventario técnico;
   - decisiones que deben preservarse;
   - riesgos;
   - comandos disponibles;
   - estado inicial de compilación/pruebas;
   - plan breve de adaptación a los prompts siguientes.

## Reglas

- No reinicialices Angular.
- No cambies versiones.
- No instales una plantilla administrativa.
- No modifiques `backend-node`.
- No implementes todavía pantallas funcionales.

## Criterios de aceptación

- Existe el documento de auditoría basado en evidencia del repositorio.
- Se conoce y documenta el comando correcto de build/test/lint.
- Se identificaron assets y reglas visuales existentes.
- El estado inicial de Git y las fallas preexistentes quedan diferenciados de cambios futuros.

