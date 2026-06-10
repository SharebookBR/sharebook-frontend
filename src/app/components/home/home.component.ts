import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';
import { MeetupService } from '../../core/services/meetup/meetup.service';
import { Meetup } from '../../core/models/Meetup';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { CategoryService } from '../../core/services/category/category.service';
import { CategoryShowcase } from '../../core/models/home-showcase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public availableBooks: Book[] = [];
  public hasBook: Boolean = true;
  public ebooks: Book[] = [];
  public recentEbooksCount: number = 0;
  public categoriesShowcase: CategoryShowcase[] = [];

  public meetups: Meetup[] = [];
  public meetupsUpcoming: Meetup[] = [];
  public meetupsCurrentPage: number = 1;
  public meetupsPerPage: number = 10;
  public showButtonMoreMeetups: boolean = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _scMeetup: MeetupService,
    private _seo: SeoService,
    private _categoryService: CategoryService
  ) {}

  ngOnInit() {
    this._seo.generateTags({});
    this.getBooks();
    this.getEbooks();
    this.getCategoriesShowcase();
    this.getMeetups();
    this.getMeetupsUpcoming();
  }

  getBooks() {
    this._scBook
      .getAvailableBooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books) => {
        this.availableBooks = books.filter((book) => book.type !== 'Eletronic');
        this.hasBook = this.availableBooks.length > 0;
      });
  }

  getCategoriesShowcase() {
    this._scBook
      .getCategoriesShowcase()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((showcase) => {
        this.categoriesShowcase = showcase;
      });
  }

  getEbooks() {
    this._scBook
      .getNewestEbooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((ebooks) => {
        this.ebooks = ebooks;
      });

    this._scBook
      .getRecentEbooksCount(7)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((response) => {
        this.recentEbooksCount = response?.total || 0;
      });
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

  scrollShelf(wrapper: HTMLElement, direction: 'left' | 'right') {
    const track = wrapper.querySelector('.shelf-track') as HTMLElement;
    if (!track) return;
    track.scrollBy({ left: direction === 'right' ? 620 : -620, behavior: 'smooth' });
    // smooth scroll is async — update arrows after animation settles
    setTimeout(() => this.updateArrows(wrapper), 400);
  }

  updateArrows(wrapper: HTMLElement) {
    const track = wrapper.querySelector('.shelf-track') as HTMLElement;
    const left = wrapper.querySelector('.shelf-arrow--left') as HTMLElement;
    const right = wrapper.querySelector('.shelf-arrow--right') as HTMLElement;
    if (!track || !left || !right) return;
    left.classList.toggle('shelf-arrow--disabled', track.scrollLeft <= 0);
    right.classList.toggle('shelf-arrow--disabled',
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
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
