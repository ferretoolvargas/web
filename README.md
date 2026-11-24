# Ferretool Vargas

[![Frontend CI](https://github.com/ferretoolvargas/web/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/ferretoolvargas/web/actions/workflows/frontend-ci.yml)
[![Sitio](https://img.shields.io/badge/sitio-GitHub%20Pages-FF5A00)](https://ferretoolvargas.github.io/web/)
![Angular](https://img.shields.io/badge/Angular-22-DD0031)
![Node](https://img.shields.io/badge/Node-22-339933)

Catálogo público y panel administrativo de **Ferretool Vargas**, ferretería ubicada en Mallasa, La Paz, Bolivia. Los clientes consultan productos y confirman disponibilidad y precio por WhatsApp; el administrador gestiona productos, catálogos, ofertas y promociones.

**Sitio publicado:** <https://ferretoolvargas.github.io/web/>

## Características

- **Catálogo público:** búsqueda, filtros, ordenamiento, paginación y detalle de producto compartible.
- **Contacto por WhatsApp:** cada producto genera un mensaje listo para enviar.
- **Área administrativa:** acceso protegido, dashboard, CRUD de productos, catálogos (categorías, subcategorías, marcas, unidades, calidades), ofertas y promociones.
- **SEO:** prerender de rutas públicas y de cada producto visible, con título, descripción, canonical y Open Graph. Sitemap validado en cada build.
- **Tema claro/oscuro** según la identidad visual oficial.
- **Sin backend por ahora:** datos desde JSON y persistencia en `localStorage`, detrás de repositorios intercambiables por HTTP.

> Los precios, existencias y ofertas actuales son datos de muestra. El área pública los oculta y muestra "Precio por consultar" hasta que el negocio los confirme. Ver [`commercial-data-status.md`](frontend-angular/docs/commercial-data-status.md).

## Stack

| Área      | Tecnología                                     |
| --------- | ---------------------------------------------- |
| Framework | Angular 22 (standalone, rutas lazy, prerender) |
| Lenguaje  | TypeScript estricto                            |
| Estilos   | SCSS con tokens CSS                            |
| Pruebas   | Vitest (unitarias) y Playwright (E2E, Chrome)  |
| Calidad   | ESLint 10 + angular-eslint, Prettier           |
| CI/CD     | GitHub Actions, publicación en rama `gh-pages` |

## Estructura

```text
.
├── frontend-angular/            # Aplicación Angular (único proyecto activo)
│   ├── src/app/core/            # Configuración, contratos, repositorios, guards, interceptor
│   ├── src/app/features/        # public/ y admin/ (rutas lazy)
│   ├── src/app/shared/          # Componentes reutilizables
│   ├── public/mock-data/        # Semillas JSON
│   ├── e2e/                     # Pruebas Playwright
│   └── docs/                    # Auditorías, contrato de backend, compartición
├── backend-node/                # Reservado para la futura API NestJS
├── ferretools-frontend-prompts/ # Prompts históricos usados para construir el frontend
└── .github/                     # Workflow de CI/CD y Dependabot
```

## Inicio rápido

Requisitos: Node.js 22 y npm 10.

```bash
cd frontend-angular
npm ci
npm start
```

La aplicación queda en <http://localhost:4200>. Para el panel entra a `/admin/login` con el usuario de desarrollo `admin@ferretools.local` / `Ferre123!` (datos locales, no son credenciales reales).

## Comandos

Ejecutar dentro de `frontend-angular/`.

| Comando                | Qué hace                                                      |
| ---------------------- | ------------------------------------------------------------- |
| `npm start`            | Servidor de desarrollo                                        |
| `npm run format:check` | Verifica formato con Prettier (`npm run format` lo corrige)   |
| `npm run lint`         | Análisis estático de TypeScript y plantillas                  |
| `npm run test:ci`      | Pruebas unitarias, una sola ejecución                         |
| `npm run e2e`          | Pruebas E2E en escritorio y móvil (requiere Google Chrome)    |
| `npm run seo:generate` | Regenera `public/sitemap.xml` desde las semillas              |
| `npm run build`        | Build de producción (falla si el sitemap está desactualizado) |
| `npm run build:pages`  | Build con base `/web/` para GitHub Pages                      |

Antes de abrir un PR conviene correr `format:check`, `lint`, `test:ci`, `build` y `e2e`: es lo mismo que valida el CI.

## Integración continua y despliegue

El workflow [`frontend-ci.yml`](.github/workflows/frontend-ci.yml) corre en cada push a `main` y en cada pull request que toque `frontend-angular/` o el propio workflow.

```text
quality ──┐   formato, lint, sitemap, pruebas unitarias
build  ───┼─► deploy   (solo push a main)
e2e    ───┘
```

- `quality`, `build` y `e2e` corren en paralelo.
- Si `e2e` falla, el reporte de Playwright se guarda como artefacto siete días.
- `deploy` espera a los tres, genera el build con base `/web/`, añade `404.html` como fallback de rutas y actualiza la rama `gh-pages`, desde la que se publica el sitio. No hace commit si no hay cambios.
- Los despliegues se encolan (no se cancelan entre sí) para no publicar a medias.
- [Dependabot](.github/dependabot.yml) propone semanalmente actualizaciones de npm y de GitHub Actions.

## Documentación

- [README del frontend](frontend-angular/README.md): rutas, configuración, persistencia, tema y SEO.
- [Contrato esperado del backend](frontend-angular/docs/backend-contract.md)
- [Estado de datos comerciales](frontend-angular/docs/commercial-data-status.md)
- [Compartir productos y WhatsApp](frontend-angular/docs/product-sharing.md)
- [Auditoría del frontend](frontend-angular/docs/frontend-audit.md) y [de rendimiento](frontend-angular/docs/performance-audit.md)

## Hoja de ruta

- API NestJS en `backend-node` según el contrato documentado, con JWT real en lugar de la autenticación simulada.
- Módulo de movimientos de inventario.
- Fotografías reales por SKU y datos comerciales confirmados (precios, existencias, horarios, entregas, pagos).
