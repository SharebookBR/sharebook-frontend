import { Injectable } from '@angular/core';

export type EnvironmentType = 'local' | 'dev' | 'prod';

export interface EnvironmentConfig {
  name: string;
  apiEndpoint: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentSwitcherService {
  private readonly STORAGE_KEY = 'sharebook_api_environment';

  private readonly environments: Record<EnvironmentType, EnvironmentConfig> = {
    local: {
      name: 'local',
      apiEndpoint: 'http://localhost:50709/api',
      displayName: 'Local'
    },
    dev: {
      name: 'dev',
      apiEndpoint: 'https://api-dev.sharebook.com.br/api',
      displayName: 'Desenvolvimento'
    },
    prod: {
      name: 'prod',
      apiEndpoint: 'https://api.sharebook.com.br/api',
      displayName: 'Produção'
    }
  };

  constructor() { }

  /**
   * Retorna o endpoint da API baseado no ambiente selecionado
   */
  getApiEndpoint(): string {
    const env = this.getCurrentEnvironment();
    return this.environments[env].apiEndpoint;
  }

  /**
   * Retorna o ambiente atual (lê do localStorage ou retorna prod como default)
   */
  getCurrentEnvironment(): EnvironmentType {
    const stored = localStorage.getItem(this.STORAGE_KEY) as EnvironmentType;

    if (stored && this.environments[stored]) {
      return stored;
    }

    return 'prod';
  }

  /**
   * Retorna a configuração completa do ambiente atual
   */
  getCurrentEnvironmentConfig(): EnvironmentConfig {
    const env = this.getCurrentEnvironment();
    return this.environments[env];
  }

  /**
   * Retorna todas as configurações de ambiente disponíveis
   */
  getAllEnvironments(): EnvironmentConfig[] {
    return Object.values(this.environments);
  }

  /**
   * Define o ambiente e recarrega a página
   */
  setEnvironment(env: EnvironmentType): void {
    if (!this.environments[env]) {
      console.error(`Ambiente inválido: ${env}`);
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, env);
    window.location.reload();
  }

  /**
   * Retorna true se o ambiente atual NÃO for produção
   */
  isDevMode(): boolean {
    return this.getCurrentEnvironment() !== 'prod';
  }

  /**
   * Remove a configuração customizada e volta pro default (prod)
   */
  reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.reload();
  }
}
