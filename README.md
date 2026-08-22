# Ferretools Vargas

Repositorio de Ferretools Vargas. Actualmente contiene el frontend Angular del catálogo público y del área administrativa simulada.

## Frontend

- Aplicación: [`frontend-angular`](frontend-angular)
- Documentación y comandos: [`frontend-angular/README.md`](frontend-angular/README.md)
- URL prevista de GitHub Pages: [ferretoolvargas.github.io/web](https://ferretoolvargas.github.io/web/)

### Ejecución local

```bash
cd frontend-angular
npm ci
npm start
```

### Validación

```bash
cd frontend-angular
npm test -- --watch=false
npm run build
npx prettier --check "src/**/*.{ts,html,scss}" "public/mock-data/*.json" "docs/*.md" README.md
```

El frontend funciona inicialmente con semillas JSON y persistencia local. Su capa de repositorios está preparada para sustituirse por una API HTTP sin reescribir los componentes.

## Backend

`backend-node` está reservado para una fase futura y no forma parte del despliegue actual de GitHub Pages.
