import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONFIG } from '../config/app-config';
import { AuthService } from '../services/auth.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const config = inject(APP_CONFIG),
    session = inject(AuthService).session();
  if (session && inject(AuthService).isAuthenticated() && request.url.startsWith(config.apiUrl))
    request = request.clone({ setHeaders: { Authorization: `Bearer ${session.accessToken}` } });
  return next(request);
};
