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
npm run format:check
npm run test:ci
npm run build
```

El frontend funciona inicialmente con semillas JSON y persistencia local. Su capa de repositorios está preparada para sustituirse por una API HTTP sin reescribir los componentes.

La rama `gh-pages` contiene el build estático. Un administrador del repositorio debe habilitar GitHub Pages desde esa rama para activar la URL pública.

## Backend

`backend-node` está reservado para una fase futura y no forma parte del despliegue actual de GitHub Pages.
