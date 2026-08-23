# 09 — Detalle público, enlaces compartibles y WhatsApp

## Objetivo

Crear una ficha pública completa y fácil de compartir por URL.

## Ruta

Implementa una ruta canónica equivalente a:

```text
/productos/:slug
```

## Contenido de la ficha

- Migas de pan.
- Imagen principal y galería accesible.
- Nombre, marca, modelo y línea de calidad.
- Precio normal y promocional.
- Disponibilidad pública.
- Resumen comercial.
- ¿Qué es?
- ¿Para qué sirve?
- Características principales.
- Especificaciones en tabla legible.
- ¿Para quién está recomendado?
- Contenido del paquete.
- Garantía, cuidados y procedencia cuando existan.
- Selector de variante/presentación cuando corresponda.
- Productos relacionados, accesorios y alternativas de otras líneas.

## WhatsApp

Usa el número comercial `+591 60514138` y genera dos acciones diferenciadas:

1. **Compartir por WhatsApp**: mensaje comercial breve con nombre, línea, precio, disponibilidad y URL canónica.
2. **Consultar por WhatsApp**: saludo, nombre, SKU, variante seleccionada, precio publicado y URL.

Usa codificación URL segura. No abras automáticamente WhatsApp sin una acción del usuario.

## Metadatos y compartición

1. Actualiza título, descripción, canonical y metadatos sociales de acuerdo con el producto.
2. Documenta en `frontend-angular/docs/product-sharing.md` la limitación real de previews de WhatsApp en una SPA estática.
3. Deja preparada una estrategia compatible con futura API/hosting: SSR, prerender o endpoint público que entregue metadatos por producto. No finjas que el cambio de etiquetas en el navegador garantiza una preview social.
4. Maneja slug inexistente con una página 404 útil.

## Criterios de aceptación

- La URL puede copiarse y abrir directamente.
- Recargar una ficha conserva el producto correcto en el entorno configurado.
- Mensajes de compartir y consultar incluyen datos correctos y URL canónica.
- La ficha es clara incluso con información técnica extensa.
- Variantes modifican la información relevante sin cambiar indebidamente el producto base.
- Las limitaciones de hosting/SEO están documentadas con honestidad.

