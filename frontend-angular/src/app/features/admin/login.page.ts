import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  template: `<main class="login-shell">
    <form class="login-card" [formGroup]="form" (ngSubmit)="submit()">
      <a routerLink="/" class="brand"
        ><span class="brand-mark">FV</span><span>Ferretools Vargas</span></a
      >
      <div>
        <span class="eyebrow">Administración</span>
        <h1>Iniciar sesión</h1>
        <p>Gestiona el catálogo y las promociones.</p>
      </div>
      <label
        >Correo<input
          id="admin-email"
          type="email"
          formControlName="email"
          autocomplete="username"
          aria-describedby="email-error"
        />
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <small id="email-error" class="field-error">Ingresa un correo válido.</small>
        }</label
      ><label
        >Contraseña<input
          id="admin-password"
          type="password"
          formControlName="password"
          autocomplete="current-password"
          aria-describedby="password-error"
        />
        @if (form.controls.password.touched && form.controls.password.invalid) {
          <small id="password-error" class="field-error">La contraseña es obligatoria.</small>
        }
      </label>
      @if (error()) {
        <div class="alert danger" role="alert">{{ error() }}</div>
      }
      <button class="button" [disabled]="loading()" [attr.aria-busy]="loading()">
        {{ loading() ? 'Ingresando…' : 'Ingresar' }}</button
      ><small>Desarrollo: admin@ferretools.local / Ferre123!</small>
    </form>
  </main>`,
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  loading = signal(false);
  error = signal('');
  form = new FormGroup({
    email: new FormControl('admin@ferretools.local', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('Ferre123!', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.controls.email.value, this.form.controls.password.value).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
