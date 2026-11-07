import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ActionButtonModule } from 'src/app/shared/action-button/action-button.module';
import { ReleaseBadgeModule } from 'src/app/shared/release-badge/release-badge.module';
import { DonationCardComponent } from './donation-card.component';

@NgModule({
  imports: [CommonModule, MatIconModule, ActionButtonModule, ReleaseBadgeModule],
  declarations: [DonationCardComponent],
  exports: [DonationCardComponent],
})
export class DonationCardModule {}
