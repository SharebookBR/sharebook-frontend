import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';

import { MeetupService } from '../../core/services/meetup/meetup.service';
import { Meetup, MeetupList } from '../../core/models/Meetup';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public availableBooks: Book[] = [];
  public hasBook: Boolean = true;

  public meetups: Meetup[] = [];
  public meetupsAll: Meetup[] = [];
  public hasMeetup: Boolean = true;
  public showButtonAllMeetups: Boolean = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(private _scBook: BookService, private _scMeetup: MeetupService) {}

  ngOnInit() {
    this.getBooks();
    this.getMeetups();
  }

  getBooks() {
    this._scBook
      .getAvailableBooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books) => {
        this.availableBooks = books;
        this.hasBook = books.length > 0 ? true : false;
      });
  }

  getMeetups() {
    this._scMeetup
      .getAll()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((meetups) => {
        this.meetupsAll = meetups.items;
        this.hasMeetup = meetups.items.length > 0 ? true : false;

        this.meetupsAll.sort((a, b) => (a.startDate > b.startDate ? -1 : 0));
        this.meetups = this.meetupsAll.slice(0, 5);

        console.log(this.meetups);
      });
  }

  showAllMetups() {
    this.meetups = this.meetupsAll;
    this.showButtonAllMeetups = false;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
