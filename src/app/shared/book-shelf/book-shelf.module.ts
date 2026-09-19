import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BookCardModule } from '../book-card/book-card.module';
import { BookShelfComponent } from './book-shelf.component';

@NgModule({
  imports: [CommonModule, RouterModule, BookCardModule],
  declarations: [BookShelfComponent],
  exports: [BookShelfComponent],
})
export class BookShelfModule {}
