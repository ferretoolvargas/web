# Prompts Codex — Frontend Ferretools Vargas

Paquete de prompts secuenciales para construir el frontend Angular de Ferretools Vargas con dos áreas:

- Área pública: catálogo, búsqueda, filtros, detalle compartible, ofertas y contacto por WhatsApp.
- Área administrativa: autenticación simulada, dashboard y gestión de catálogos, productos, ofertas y promociones.

El frontend comienza con JSON y persistencia simulada, pero debe conservar contratos y servicios listos para consumir posteriormente la API NestJS.

## Repositorio esperado

```text
raíz/
├── frontend-angular/
├── backend-node/
└── README.md
```

## Ejecución recomendada

1. Copiar la carpeta `codex-prompts` de este paquete a la raíz del repositorio, o conservarla fuera y proporcionar a Codex su ruta.
2. Abrir Codex en la raíz del repositorio.
3. Entregarle el contenido de `00-EJECUTAR-TODOS.md`.
4. Codex debe ejecutar los prompts `01` a `11` en orden, validando cada fase.

También se puede ejecutar un prompt a la vez. Esto es recomendable si se desea revisar visualmente cada etapa antes de continuar.

## Orden

1. Auditoría inicial
2. Base técnica y sistema visual
3. Contratos, JSON y acceso a datos
4. Autenticación y layouts
5. Dashboard administrativo
6. Catálogos administrativos
7. Productos administrativos
8. Catálogo público
9. Detalle público y WhatsApp
10. Ofertas y promociones
11. Calidad, pruebas y documentación

## Decisiones vinculantes

- Trabajar únicamente en `frontend-angular`, excepto una actualización documental explícita del `README.md` raíz en la fase final.
- No modificar `backend-node`.
- Respetar la versión y configuración Angular existentes; no actualizar dependencias sin necesidad.
- Usar TypeScript y Tailwind CSS ya configurado o instalarlo solamente si el proyecto aún no lo tiene y es compatible.
- Respetar el manual de identidad y los logos existentes. No inventar ni rediseñar la marca.
- Implementar dark/light de forma centralizada.
- No quemar datos comerciales dentro de componentes o plantillas.
- Consumir JSON mediante servicios/repositorios intercambiables por HTTP.
- Simular CRUD con persistencia local sin contaminar los componentes.
- Diseñar paginación compatible con servidor desde el inicio.
- Mostrar las líneas como Económico, Estándar y Profesional; no mostrar “calidad baja”.
- Usar moneda boliviana (`Bs`) y español como idioma inicial.
- WhatsApp comercial: `+591 60514138`.

