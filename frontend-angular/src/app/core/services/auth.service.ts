import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../models/auth-repository';
import { AuthSession } from '../models/domain.models';
import { MockAuthRepository } from './mock-auth.repository';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);
  private repository: AuthRepository = inject(MockAuthRepository);
  private key = 'fv-session';
  private state = signal<AuthSession | null>(this.storage.get<AuthSession>(this.key));
  readonly session = this.state.asReadonly();
  readonly authenticated = computed(
    () => !!this.state() && Date.parse(this.state()!.expiresAt) > Date.now(),
  );
  constructor() {
    if (this.state() && !this.isAuthenticated()) this.logout();
  }
  login(email: string, password: string): Observable<AuthSession> {
    return this.repository.login({ email, password }).pipe(
      tap((session) => {
        this.storage.set(this.key, session);
        this.state.set(session);
      }),
    );
  }
  isAuthenticated(): boolean {
    const session = this.state();
    if (!session || !Number.isFinite(Date.parse(session.expiresAt))) return false;
    if (Date.parse(session.expiresAt) <= Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }
  logout(): void {
    this.storage.remove(this.key);
    this.state.set(null);
  }
}
