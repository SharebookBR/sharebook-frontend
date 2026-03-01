import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from './book-card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BookCardComponent],
  exports: [BookCardComponent],
})
export class BookCardModule {}
