import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { AuthCredentials, AuthRepository } from '../models/auth-repository';
import { AuthSession } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class MockAuthRepository implements AuthRepository {
  login(credentials: AuthCredentials): Observable<AuthSession> {
    if (credentials.email !== 'admin@ferretools.local' || credentials.password !== 'Ferre123!')
      return throwError(() => new Error('Correo o contraseña incorrectos.')).pipe(delay(300));

    return of<AuthSession>({
      user: {
        id: 'u1',
        name: 'Administrador Vargas',
        email: credentials.email,
        role: 'ADMINISTRADOR',
      },
      accessToken: 'mock-token-ferretools',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    }).pipe(delay(300));
  }
}
