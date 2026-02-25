import { Component, OnInit } from '@angular/core';
import { EnvironmentSwitcherService } from '../../core/services/environment-switcher/environment-switcher.service';

@Component({
  selector: 'app-dev-mode-banner',
  templateUrl: './dev-mode-banner.component.html',
  styleUrls: ['./dev-mode-banner.component.scss']
})
export class DevModeBannerComponent implements OnInit {
  showBanner = false;
  environmentName = '';

  constructor(private envSwitcher: EnvironmentSwitcherService) { }

  ngOnInit(): void {
    this.showBanner = this.envSwitcher.isDevMode();

    if (this.showBanner) {
      const config = this.envSwitcher.getCurrentEnvironmentConfig();
      this.environmentName = config.displayName;
    }
  }
}
