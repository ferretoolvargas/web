import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  template:
    '<section class="page state"><h1>Página no encontrada</h1><p>La dirección no existe o cambió.</p><a class="button" routerLink="/">Ir al inicio</a></section>',
})
export class NotFoundPage {}
