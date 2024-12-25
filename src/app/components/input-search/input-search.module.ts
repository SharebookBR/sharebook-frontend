import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSearchComponent } from './input-search.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  declarations: [InputSearchComponent],
  exports: [InputSearchComponent]
})
export class InputSearchModule {}
