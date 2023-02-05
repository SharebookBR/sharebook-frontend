import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';

import { MeetupService } from '../../core/services/meetup/meetup.service';
import { Meetup } from '../../core/models/Meetup';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public availableBooks: Book[] = [];
  public hasBook: Boolean = true;

  public meetups: Meetup[] = [];
  public meetupsCurrentPage: number = 1;
  public meetupsPerPage: number = 10;
  public showButtonMoreMeetups: boolean = true;

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
      .get(this.meetupsCurrentPage, this.meetupsPerPage)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((meetups) => {
        this.meetups.push(...meetups.items);

        const maxPage = Math.ceil(meetups.totalItems / meetups.itemsPerPage);
        this.showButtonMoreMeetups = this.meetupsCurrentPage < maxPage;
      });
  }

  showMoreMetups() {
    this.meetupsCurrentPage++;
    this.getMeetups();
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
