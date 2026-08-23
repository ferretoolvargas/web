# 04 — Autenticación simulada y layouts definitivos

## Objetivo

Implementar el acceso administrativo simulado con una estructura lista para JWT.

## Tareas

1. Construye una pantalla `/admin/login` clara y acorde con Ferretools Vargas.
2. Implementa Reactive Forms, validación, mensajes accesibles y estados de carga/error.
3. Usa un `AuthService` y repositorio mock; no compares credenciales en el componente.
4. Simula una respuesta compatible con futura API:
   - usuario;
   - access token ficticio;
   - permisos o rol;
   - expiración simulada.
5. Implementa almacenamiento de sesión encapsulado.
6. Crea guard funcional para rutas administrativas.
7. Prepara interceptor de autenticación para la futura API, evitando enviar tokens a archivos mock.
8. Implementa cierre de sesión y redirecciones seguras.
9. Completa el layout administrativo:
   - sidebar responsive;
   - topbar;
   - nombre del usuario;
   - selector dark/light;
   - menú inicial;
   - navegación móvil accesible.
10. Completa el encabezado/pie público con enlaces de marca y redes ya conocidas, sin inventar Facebook si sigue pendiente.

## Roles iniciales simulados

- Administrador.
- Vendedor.
- Almacén.

No desarrolles todavía una matriz compleja de permisos; deja el modelo extensible.

## Criterios de aceptación

- Una ruta administrativa no abre sin sesión.
- Login y logout funcionan con datos mock.
- La sesión sobrevive a una recarga según la política definida.
- No hay lógica de autenticación dentro de componentes presentacionales.
- Layouts funcionan en escritorio y móvil.

