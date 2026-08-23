# Ferretool Vargas — frontend

Aplicación Angular 22 standalone para el catálogo público y la administración de Ferretool Vargas. Esta etapa funciona sin backend mediante JSON y persistencia local, conservando contratos intercambiables por HTTP.

## Requisitos

- Node.js 22.
- npm 10.
- Navegador moderno con `localStorage`.

## Instalación y comandos

```bash
npm ci
npm start
npm run format:check
npm run lint
npm run test:ci
npm run e2e
npm run build
```

`npm run build:pages` genera el build con base `/web/` para GitHub Pages. `npm run e2e` ejecuta Playwright en Chrome para escritorio y móvil; requiere Google Chrome instalado. `npm run lint` analiza TypeScript y las plantillas inline con ESLint 10 y angular-eslint 22. El proyecto combina TypeScript estricto, Prettier, Vitest, Playwright y build de producción.

GitHub Actions ejecuta `npm ci`, formato, lint, pruebas unitarias, build y E2E para los cambios de `frontend-angular`. Si Playwright falla, conserva su reporte como artefacto durante siete días.

## Rutas

| Zona           | Rutas                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Pública        | `/`, `/catalogo`, `/ofertas`, `/contacto`, `/productos/:slug`                                                                   |
| Acceso         | `/admin/login`                                                                                                                  |
| Administración | `/admin`, `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/:id/editar`, `/admin/catalogos`, `/admin/promociones` |

Las rutas administrativas usan guard. El editor de productos advierte antes de salir con cambios sin guardar.

## Usuario mock

- Correo: `admin@ferretools.local`
- Contraseña: `Ferre123!`
- Rol: Administrador

Son datos locales de desarrollo, no credenciales reales.

## Estructura

```text
src/app/
├── core/       # configuración, contratos, repositorios, guard e interceptor
├── shared/     # componentes de presentación reutilizables
└── features/
    ├── public/ # inicio, catálogo, ofertas y detalle
    └── admin/  # acceso, dashboard y gestiones
public/mock-data/ # semillas JSON
docs/             # auditoría, compartición y contrato de backend
```

Todos los features se cargan mediante rutas lazy. Ningún componente importa JSON ni usa directamente `localStorage`.

## Configuración y repositorios

`APP_CONFIG`, en `core/config/app-config.ts`, centraliza:

- `useMocks`: selecciona mocks o HTTP.
- `mockUrl`: ubicación de las semillas.
- `apiUrl`: prefijo de la futura API.
- `mockLatencyMs`: latencia simulada, configurable a cero en tests.

Los repositorios devuelven `ApiResponse<T>` o `PaginatedResponse<T>`. La paginación usa `page`, `limit`, `total` y `totalPages`; búsqueda, filtros y orden se procesan antes de cortar la página.

Para conectar NestJS se cambia `useMocks` y se completan las implementaciones HTTP con los contratos descritos en [backend-contract.md](docs/backend-contract.md). Los componentes no deben modificarse. El interceptor adjunta el token solamente a URLs bajo `apiUrl`, nunca a semillas.

## Persistencia y semillas

`StorageService` es el único acceso de la aplicación a `localStorage`. Productos, catálogos, ofertas y promociones persisten al recargar. En administración, **Restaurar datos de muestra** elimina esos cambios y recarga las semillas; no elimina la preferencia de tema ni la sesión.

## Tema e identidad

El tema claro/oscuro usa tokens CSS, respeta inicialmente `prefers-color-scheme` y persiste la selección. La interfaz aplica el manual oficial: naranja `#FF5A00`, amarillo `#FFC300`, negro `#111111`, blanco `#FFFFFF`, Montserrat para títulos e Inter para interfaz con respaldo Arial. Los logos oficiales están en `public/brand` y cambian entre sus versiones light/dark según el tema y el espacio disponible.

## SEO, rutas directas y WhatsApp

Cada producto actualiza título, descripción, canonical y Open Graph. Consulta [product-sharing.md](docs/product-sharing.md): una SPA estática no garantiza previews sociales por producto y producción debe evaluar SSR, prerender o HTML generado por backend/edge.

En hosting estático se necesita fallback a `index.html`. El despliegue actual a `gh-pages` genera `404.html` y se publica en `https://ferretoolvargas.github.io/web/`.

## Siguiente etapa

Implementar la API NestJS según [backend-contract.md](docs/backend-contract.md), sustituir autenticación mock por JWT real, definir movimientos de inventario y proporcionar identidad visual oficial.
