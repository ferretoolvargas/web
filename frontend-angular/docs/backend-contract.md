# Contrato esperado para NestJS

El frontend está preparado para una API REST bajo `apiUrl`. Las respuestas deben conservar las estructuras TypeScript de `core/models`.

## Formatos comunes

```json
{ "data": {}, "message": "Operación correcta" }
```

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 1 }
}
```

Los errores de validación deben incluir `statusCode`, `message` y `errors`, donde `errors` relaciona campos con listas de mensajes.

## Autenticación

- `POST /auth/login`: recibe correo y contraseña; devuelve usuario, `accessToken` JWT, rol/permisos y `expiresAt` ISO 8601.
- Las rutas administrativas usan `Authorization: Bearer <token>`.
- Roles iniciales: Administrador, Vendedor y Almacén.

## Productos y catálogos

- `GET /products`: acepta `page`, `limit`, `search`, `sortBy`, `sortOrder` y filtros de catálogo, calidad, precio, disponibilidad, oferta y estado.
- `GET /products/:slug`: detalle público canónico.
- `GET /admin/products/:id`: detalle administrativo.
- `GET /admin/products/slug-available`: valida slug con `excludeId` opcional.
- `POST /products` y `PUT /products/:id`: guardan el DTO completo con precios numéricos, imágenes, especificaciones y variantes.
- Los catálogos requieren endpoints paginados y CRUD para categorías, subcategorías, marcas, unidades y calidades.

El backend debe impedir slugs/SKU duplicados, ciclos de categorías, precios o existencias negativas. El stock no debe actualizarse como un campo ordinario cuando exista el módulo de movimientos.

## Dashboard, ofertas y promociones

- `GET /dashboard`: respuesta agregada con ventas del día, productos activos, poco stock, ofertas, movimientos y productos consultados.
- `GET /offers` y `GET /promotions`: soportan paginación, búsqueda, estado y vigencia.
- Endpoints POST/PUT deben validar fechas, precios, descuentos y condiciones.

La API determina vigencia con zona comercial `America/La_Paz`. Un precio promocional solo aplica cuando la oferta está activa y la fecha actual cae dentro del rango.

## Compartición y hosting

Para previews de WhatsApp, el backend o la capa de hosting debe servir HTML con Open Graph por slug, o integrarse con SSR/prerender de Angular. Cambiar etiquetas solo en el navegador no es suficiente para crawlers.
