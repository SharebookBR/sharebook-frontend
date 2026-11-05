import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from './book-card.component';
import { ReleaseBadgeModule } from '../release-badge/release-badge.module';

@NgModule({
  imports: [CommonModule, ReleaseBadgeModule],
  declarations: [BookCardComponent],
  exports: [BookCardComponent],
})
export class BookCardModule {}
