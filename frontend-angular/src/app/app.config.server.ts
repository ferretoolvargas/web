import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_CONFIG, appConfigValue } from './core/config/app-config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: APP_CONFIG, useValue: { ...appConfigValue, mockLatencyMs: 0 } },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
