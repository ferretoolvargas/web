# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- `frontend-angular/` — the only active project (Angular 22 standalone, SSR/prerender, Vitest, Playwright). All npm commands run from here.
- `backend-node/` — placeholder for a future NestJS API; not part of the build or deploy.
- `ferretools-frontend-prompts/` — historical sequential prompts used to build the frontend; not code.
- Project docs and UI copy are in Spanish.

## Commands (run inside `frontend-angular/`)

```bash
npm ci
npm start                  # ng serve
npm run format:check       # Prettier (npm run format to fix)
npm run lint               # ESLint 10 + angular-eslint (TS and inline templates)
npm run test:ci            # Vitest via @angular/build:unit-test, single run
npm test                   # watch mode
npx ng test --include='src/app/core/services/catalog.service.spec.ts'   # single spec
npm run e2e                # Playwright; needs Google Chrome installed (desktop + mobile)
npx playwright test e2e/admin-crud.spec.ts                              # single e2e file
npm run seo:check          # fails if public/sitemap.xml is stale; seo:generate rewrites it
npm run build              # runs seo:check first (prebuild)
npm run build:pages        # base-href /web/ for GitHub Pages
```

CI (`.github/workflows/frontend-ci.yml`) runs format, lint, unit tests, build and e2e (Node 22); pushes to `main` then publish the `build:pages` output to the `gh-pages` branch with a `404.html` copy of `index.html`. When adding or changing products/offers in `public/mock-data/products.json`, run `npm run seo:generate` or the build fails.

## Architecture

- **Repository/mock pattern.** `APP_CONFIG` (`core/config/app-config.ts`) has `useMocks`, `apiUrl`, `mockUrl`, `mockLatencyMs`. Services in `core/services` implement the contracts in `core/models/*-repository.ts` / `repository.models.ts` (`ApiResponse<T>`, `PaginatedResponse<T>` with `page/limit/total/totalPages`; search, filter and sort happen before pagination). Today everything reads seeds from `public/mock-data/*.json` via `mock-data.service.ts`; switching to the NestJS API (see `docs/backend-contract.md`) must not require touching components.
- **Persistence.** `StorageService` is the only code allowed to touch `localStorage`; components must not import JSON or use storage directly. Admin edits persist locally; "Restaurar datos de muestra" resets data but keeps theme and session.
- **Auth.** Mock auth (`mock-auth.repository.ts`, `auth.service.ts`) with `authGuard`/`guestGuard`; `auth.interceptor.ts` attaches the token only to URLs under `apiUrl`, never to seeds. `unsavedChangesGuard` protects the product form.
- **Routing.** All features are lazy `loadComponent` routes: public (`features/public`, under `PublicLayout`) and `/admin/**` (`features/admin`). Public routes and each visible product are prerendered (`app.routes.server.ts`); admin routes stay client-rendered. SEO metadata (title, description, canonical, Open Graph) matters for public pages; see `docs/product-sharing.md`.
- **Unconfirmed commercial data is hidden.** Prices, stock, offers and promotions in the JSON are mock admin data. `COMMERCIAL_STATUS` keeps their public display disabled: the public area shows "Precio por consultar" / "Consultar disponibilidad", computes no public discounts, and routes confirmation to WhatsApp. Don't surface these values publicly or re-enable commercial filters without confirmed data (see `docs/commercial-data-status.md`).
- **Products without photos** have `images: []` and render the accessible "Imagen no disponible" placeholder; future photos go in `public/products/[sku]-principal.webp` / `[sku]-01.webp`.
- **Brand/contact data** (WhatsApp, social links, name) is centralized in `core/config/brand.config.ts`. Theme (light/dark) uses CSS tokens and brand colors (orange `#FF5A00`, yellow `#FFC300`, Montserrat titles, Inter UI).

## Conventions

Prettier formatting is enforced in CI (covers `src`, `e2e`, `scripts`, mock JSON and `docs/*.md`). Mock admin login for dev/e2e: `admin@ferretools.local` / `Ferre123!`.
