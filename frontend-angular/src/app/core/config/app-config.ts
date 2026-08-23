import { InjectionToken, isDevMode } from '@angular/core';

export interface AppConfig {
  useMocks: boolean;
  apiUrl: string;
  mockUrl: string;
  mockLatencyMs: number;
}
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
export const appConfigValue: AppConfig = {
  useMocks: true,
  apiUrl: '/api',
  mockUrl: 'mock-data',
  mockLatencyMs: isDevMode() ? 120 : 0,
};
