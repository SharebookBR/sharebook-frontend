import { Component, Input } from '@angular/core';
import { Meetup } from 'src/app/core/models/Meetup';

@Component({
  selector: 'app-card-meetup',
  templateUrl: './card-meetup.component.html',
  styleUrls: ['./card-meetup.component.css'],
})
export class CardMeetupComponent {
  @Input() meetup: Meetup;

  GetMeetupUrl(): string {
    if (!this.meetup.youtubeUrl) return this.meetup.symplaEventUrl;

    let meetupDate = new Date(this.meetup.startDate);
    let currDate = new Date();

    if (currDate <= meetupDate) return this.meetup.symplaEventUrl;

    return this.meetup.youtubeUrl;
  }
}
