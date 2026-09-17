import { NgModule, InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiEndpoint: string;
}

export function createAppConfig(): AppConfig {
  return {
    apiEndpoint: environment.apiEndpoint,
  };
}

@NgModule({
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: createAppConfig
    }
  ]
})
export class AppConfigModule {}
