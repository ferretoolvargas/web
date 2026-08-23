# 02 — Base técnica, rutas y sistema visual

## Objetivo

Crear el esqueleto del frontend sin desarrollar aún los módulos de negocio completos.

## Tareas

1. Adapta la arquitectura existente, sin reemplazarla, hacia una separación equivalente a:

```text
src/app/
├── core/
├── shared/
└── features/
```

2. Prepara rutas lazy para dos zonas:
   - públicas: inicio, catálogo y futuro detalle de producto;
   - administrativas: acceso y rutas protegidas futuras.
3. Crea layouts separados y mínimos:
   - `PublicLayout`;
   - `AdminLayout`.
4. Centraliza tokens de identidad para:
   - fondos, superficies, texto, bordes;
   - color primario y secundario;
   - success, warning, danger e info;
   - estados dark/light.
5. Usa los logos dark/light y favicon existentes. No alteres sus formas.
6. Implementa selector dark/light con:
   - preferencia persistida;
   - respeto inicial a `prefers-color-scheme`;
   - aplicación sin parpadeo notable.
7. Prepara utilidades compartidas iniciales solamente si son usadas:
   - botón;
   - campo de texto;
   - spinner;
   - estado vacío;
   - alerta;
   - encabezado de página.
8. Crea páginas provisionales limpias para `/`, `/catalogo`, `/admin/login` y `/admin`.
9. Asegura navegación responsive y accesible.

## Reglas visuales

- Respeta el manual de identidad existente.
- No conviertas el catálogo en un dashboard.
- El área pública debe ser comercial y fácil de entender.
- El área administrativa puede ser más compacta y operativa.
- No agregues botones o secciones publicitarias arbitrarias.

## Criterios de aceptación

- Las rutas pública y administrativa cargan con layouts distintos.
- Dark/light funciona y persiste.
- No hay colores de marca repetidos sin token central.
- La aplicación es navegable con teclado y responsive.
- Build y pruebas existentes pasan.

