import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());

  it('delega credenciales y persiste la sesión mock', async () => {
    const service = TestBed.inject(AuthService);
    const session = await firstValueFrom(service.login('admin@ferretools.local', 'Ferre123!'));
    expect(session.user.role).toBe('ADMINISTRADOR');
    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('fv-session')).toContain('mock-token-ferretools');
  });

  it('rechaza credenciales incorrectas sin crear sesión', async () => {
    const service = TestBed.inject(AuthService);
    let message = '';
    try {
      await firstValueFrom(service.login('otro@correo.test', 'incorrecta'));
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('incorrectos');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('elimina una sesión expirada al iniciar', () => {
    localStorage.setItem(
      'fv-session',
      JSON.stringify({
        user: { id: 'u1', name: 'Usuario', email: 'a@b.test', role: 'VENDEDOR' },
        accessToken: 'vencido',
        expiresAt: '2020-01-01T00:00:00Z',
      }),
    );
    const service = TestBed.inject(AuthService);
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('fv-session')).toBeNull();
  });
});
