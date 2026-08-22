# Ferretools Vargas — frontend

Aplicación Angular 22 standalone para catálogo público y administración simulada.

## Requisitos y comandos

- Node.js 22 y npm 10.
- `npm ci`, `npm start`, `npm test -- --watch=false`, `npm run build`.
- Formato: `npx prettier --check .`. No existe script de lint; TypeScript estricto se valida al compilar.

## Rutas y acceso

El área pública usa `/`, `/catalogo`, `/ofertas` y `/productos/:slug`. El acceso mock está en `/admin/login`; el dashboard y las gestiones viven bajo `/admin`.

Usuario de desarrollo: `admin@ferretools.local` / `Ferre123!` (no son credenciales reales).

## Arquitectura y datos

`core` contiene configuración, contratos, guard, interceptor y servicios; `shared`, UI reutilizable; `features/public` y `features/admin`, rutas lazy y layouts. Las semillas están en `public/mock-data` y ningún componente las importa.

`APP_CONFIG` centraliza `useMocks`, `mockUrl`, `apiUrl` y latencia. `CatalogService` entrega paginación `page`, `limit`, `total`, `totalPages` y encapsula persistencia con `StorageService`; `reset()` restaura semillas. Para NestJS se sustituye el repositorio mock por uno HTTP con los mismos contratos. El interceptor solo envía tokens bajo `apiUrl`.

El tema usa tokens CSS, preferencia del sistema y persistencia. Los colores son provisionales porque no se proporcionó identidad oficial; `FV` es un marcador, no un logo. Consulta [docs/product-sharing.md](docs/product-sharing.md) sobre SEO/previews.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
