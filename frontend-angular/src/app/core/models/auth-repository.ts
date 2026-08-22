import { Observable } from 'rxjs';
import { AuthSession } from './domain.models';

export interface AuthCredentials {
  email: string;
  password: string;
}

/** Compatible con un futuro POST /auth/login que entregue sesión JWT. */
export abstract class AuthRepository {
  abstract login(credentials: AuthCredentials): Observable<AuthSession>;
}
