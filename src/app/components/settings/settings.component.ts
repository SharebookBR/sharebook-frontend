import { Component, OnInit } from '@angular/core';
import { EnvironmentSwitcherService, EnvironmentType, EnvironmentConfig } from '../../core/services/environment-switcher/environment-switcher.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  environments: EnvironmentConfig[] = [];
  selectedEnvironment: EnvironmentType;
  currentEnvironment: EnvironmentType;

  constructor(private envSwitcher: EnvironmentSwitcherService) { }

  ngOnInit(): void {
    this.environments = this.envSwitcher.getAllEnvironments();
    this.currentEnvironment = this.envSwitcher.getCurrentEnvironment();
    this.selectedEnvironment = this.currentEnvironment;
  }

  applyEnvironment(): void {
    if (this.selectedEnvironment === this.currentEnvironment) {
      return;
    }

    const confirmMessage = `Tem certeza que deseja trocar para o ambiente "${this.getEnvironmentName(this.selectedEnvironment)}"?\n\nA página será recarregada.`;

    if (confirm(confirmMessage)) {
      this.envSwitcher.setEnvironment(this.selectedEnvironment);
    }
  }

  getEnvironmentName(env: EnvironmentType): string {
    const config = this.environments.find(e => e.name === env);
    return config ? config.displayName : env;
  }

  get hasChanges(): boolean {
    return this.selectedEnvironment !== this.currentEnvironment;
  }
}
