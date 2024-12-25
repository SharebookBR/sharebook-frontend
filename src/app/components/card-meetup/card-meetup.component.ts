import { Component, Input, OnInit } from '@angular/core';
import { Meetup } from 'src/app/core/models/Meetup';

import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
registerLocaleData(localePT);

@Component({
  selector: 'app-card-meetup',
  templateUrl: './card-meetup.component.html',
  styleUrls: ['./card-meetup.component.css'],
})
export class CardMeetupComponent implements OnInit {
  @Input() meetup: Meetup;
  isUpcoming: boolean = false;

  ngOnInit() {
    let meetupDate = new Date(this.meetup.startDate);
    let currDate = new Date();
    this.isUpcoming = currDate <= meetupDate;
  }

  GetMeetupUrl(): string {
    if (!this.meetup.youtubeUrl || this.isUpcoming) return this.meetup.symplaEventUrl;
    else return this.meetup.youtubeUrl;
  }
}
