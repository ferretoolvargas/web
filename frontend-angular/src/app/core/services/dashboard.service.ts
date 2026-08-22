import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { DashboardRepository } from '../models/dashboard-repository';
import { ApiResponse, DashboardData } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class DashboardService implements DashboardRepository {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getSummary(): Observable<DashboardData> {
    if (!this.config.useMocks)
      return this.http
        .get<ApiResponse<DashboardData>>(`${this.config.apiUrl}/dashboard`)
        .pipe(map((response) => response.data));
    return this.http
      .get<DashboardData>(`${this.config.mockUrl}/dashboard.json`)
      .pipe(delay(this.config.mockLatencyMs));
  }
}
