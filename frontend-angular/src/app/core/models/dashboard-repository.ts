import { Observable } from 'rxjs';
import { DashboardData } from './domain.models';

/** Respuesta agregada; los cálculos comerciales pertenecen al backend. */
export abstract class DashboardRepository {
  abstract getSummary(): Observable<DashboardData>;
}
