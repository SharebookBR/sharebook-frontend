import { NgModule, InjectionToken } from '@angular/core';
import { EnvironmentSwitcherService } from './core/services/environment-switcher/environment-switcher.service';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiEndpoint: string;
}

export function createAppConfig(): AppConfig {
  const envSwitcher = new EnvironmentSwitcherService();
  return {
    apiEndpoint: envSwitcher.getApiEndpoint()
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
