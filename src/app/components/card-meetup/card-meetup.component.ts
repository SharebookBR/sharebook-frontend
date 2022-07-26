import { Component, OnInit, Input } from '@angular/core';
import { Meetup } from 'src/app/core/models/Meetup';

@Component({
  selector: 'app-card-meetup',
  templateUrl: './card-meetup.component.html',
  styleUrls: ['./card-meetup.component.css'],
})
export class CardMeetupComponent implements OnInit {
  @Input() meetup: Meetup;

  ngOnInit() {
    // This is intentional
  }
}
