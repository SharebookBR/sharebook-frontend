import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardMeetupComponent } from './card-meetup.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [CardMeetupComponent],
  exports: [CardMeetupComponent],
})
export class CardMeetupModule {}
