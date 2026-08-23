# Ferretools Vargas

Repositorio de Ferretools Vargas. Actualmente contiene el frontend Angular del catálogo público y del área administrativa simulada.

## Frontend

- Aplicación: [`frontend-angular`](frontend-angular)
- Documentación y comandos: [`frontend-angular/README.md`](frontend-angular/README.md)
- Sitio publicado en GitHub Pages: [ferretoolvargas.github.io/web](https://ferretoolvargas.github.io/web/)

### Ejecución local

```bash
cd frontend-angular
npm ci
npm start
```

### Validación

```bash
cd frontend-angular
npm run format:check
npm run lint
npm run test:ci
npm run build
npm run e2e
```

El frontend funciona inicialmente con semillas JSON y persistencia local. Su capa de repositorios está preparada para sustituirse por una API HTTP sin reescribir los componentes.

Cada push a `main` ejecuta formato, lint, pruebas unitarias, build y pruebas E2E. Si todas las validaciones pasan, GitHub Actions actualiza la rama `gh-pages`, desde la que se publica automáticamente el sitio.

## Backend

`backend-node` está reservado para una fase futura y no forma parte del despliegue actual de GitHub Pages.
