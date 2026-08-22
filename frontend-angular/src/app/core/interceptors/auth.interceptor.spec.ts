import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG, appConfigValue } from '../config/app-config';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const authStub = {
    session: () => ({ accessToken: 'token-prueba' }),
    isAuthenticated: () => true,
  };
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: appConfigValue },
        { provide: AuthService, useValue: authStub },
      ],
    }),
  );

  it('adjunta token solamente a la futura API', () => {
    const http = TestBed.inject(HttpTestingController);
    const httpClient = TestBed.inject(HttpClient);
    httpClient.get('/api/products').subscribe();
    expect(http.expectOne('/api/products').request.headers.get('Authorization')).toBe(
      'Bearer token-prueba',
    );
    httpClient.get('/mock-data/products.json').subscribe();
    expect(http.expectOne('/mock-data/products.json').request.headers.has('Authorization')).toBe(
      false,
    );
    http.verify();
  });
});
