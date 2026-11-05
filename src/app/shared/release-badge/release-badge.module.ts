import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReleaseBadgeComponent } from './release-badge.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ReleaseBadgeComponent],
  exports: [ReleaseBadgeComponent],
})
export class ReleaseBadgeModule {}
