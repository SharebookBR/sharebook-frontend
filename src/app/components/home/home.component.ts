import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';
import { CategoryService } from '../../core/services/category/category.service';
import { Category } from '../../core/models/category';

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

  public categories: Category[] = [];
  public categoryBookCount: Map<string, number> = new Map();

  public meetups: Meetup[] = [];
  public meetupsUpcoming: Meetup[] = [];
  public meetupsCurrentPage: number = 1;
  public meetupsPerPage: number = 10;
  public showButtonMoreMeetups: boolean = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _scMeetup: MeetupService,
    private _scCategory: CategoryService
  ) {}

  ngOnInit() {
    this.getBooks();
    this.getCategories();
    this.getMeetups();
    this.getMeetupsUpcoming();
  }

  getBooks() {
    this._scBook
      .getAvailableBooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books) => {
        this.availableBooks = books;
        this.hasBook = books.length > 0 ? true : false;
        this.countBooksByCategory();
      });
  }

  getCategories() {
    this._scCategory
      .getAllWithSlug()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((categories) => {
        this.categories = categories;
        this.countBooksByCategory();
      });
  }

  countBooksByCategory() {
    if (this.availableBooks.length === 0 || this.categories.length === 0) {
      return;
    }
    this.categoryBookCount.clear();
    this.availableBooks.forEach((book) => {
      if (book.categoryId) {
        const count = this.categoryBookCount.get(book.categoryId) || 0;
        this.categoryBookCount.set(book.categoryId, count + 1);
      }
    });
  }

  getCategoryBookCount(categoryId: number): number {
    return this.categoryBookCount.get(String(categoryId)) || 0;
  }

  getMeetups() {
    // meetups já realizados
    this._scMeetup
      .get(this.meetupsCurrentPage, this.meetupsPerPage)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((meetups) => {
        this.meetups.push(...meetups.items);

        const maxPage = Math.ceil(meetups.totalItems / meetups.itemsPerPage);
        this.showButtonMoreMeetups = this.meetupsCurrentPage < maxPage;
      });
  }

  getMeetupsUpcoming() {
    // próximos meetups
    this._scMeetup
      .get(1, 50, true)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((meetups) => {
        this.meetupsUpcoming.push(...meetups.items);

        this.meetupsUpcoming.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
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
