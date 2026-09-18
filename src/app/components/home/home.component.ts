import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';
import { MeetupService } from '../../core/services/meetup/meetup.service';
import { Meetup } from '../../core/models/Meetup';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { CategoryService } from '../../core/services/category/category.service';
import { CategoryShowcase, ShowcaseBookItem } from '../../core/models/home-showcase';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  public availableBooks: ShowcaseBookItem[] = [];
  public hasBook: Boolean = true;
  public ebooks: Book[] = [];
  public recentEbooksCount: number = 0;
  public availableEbooksCount: number = 0;
  public categoriesShowcase: CategoryShowcase[] = [];
  public topDownloadedEbooks: ShowcaseBookItem[] = [];

  // Vitrine editorial fixa — Odisseia em alta, clássicos da mitologia grega.
  // Remover ou trocar os slugs quando o gancho editorial passar.
  private readonly MYTHOLOGY_SHOWCASE_SLUGS = [
    'odisseia',
    'iliada',
    'eneida',
    'a-caixa-de-pandora',
    'faetonte-filho-de-apolo',
    'o-minotauro',
    'o-veu-de-penelope',
  ];
  public mythologyShowcase: Book[] = [];

  // Vitrine editorial fixa — clássicos e horror literário, sem títulos infantis.
  private readonly HORROR_SHOWCASE_SLUGS = [
    'dracula',
    'frankenstein_copy1',
    'strange-case-of-dr-jekyll-and-mr-hyde',
    'carmilla-edicion-en-espanol',
    'the-black-cat',
    'the-turn-of-the-screw',
    'o-sinaleiro',
    'noite-na-taverna',
    'a-ilha-do-dr-moreau',
    'the-vampyre',
    'the-horla',
    'the-castle-of-otranto',
    'a-metamorfose_copy2',
    'historias-da-meia-noite',
    'ilha-da-caveira',
  ];
  public horrorShowcase: Book[] = [];

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
    this._seo.generateTags({
      title: 'Livros grátis, digitais e físicos',
      description:
        'Encontre livros gratuitos para ler e compartilhar. Explore livros digitais e encontre livros físicos disponíveis para doação no Sharebook.'
    });
    this._seo.addStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://www.sharebook.com.br/#organization',
          name: 'ShareBook',
          url: 'https://www.sharebook.com.br/'
        },
        {
          '@type': 'WebSite',
          '@id': 'https://www.sharebook.com.br/#website',
          url: 'https://www.sharebook.com.br/',
          name: 'ShareBook',
          publisher: {
            '@id': 'https://www.sharebook.com.br/#organization'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.sharebook.com.br/buscar/{search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    });
    this.getBooks();
    this.getEbooks();
    this.getMythologyShowcase();
    this.getHorrorShowcase();
    this.getTopDownloadedEbooks();
    this.getCategoriesShowcase();
    this.getMeetups();
    this.getMeetupsUpcoming();
  }

  getMythologyShowcase() {
    forkJoin(
      this.MYTHOLOGY_SHOWCASE_SLUGS.map((slug) =>
        this._scBook.getBySlug(slug).pipe(catchError(() => of(null)))
      )
    )
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books) => {
        this.mythologyShowcase = books.filter((book) => !!book);
      });
  }

  getHorrorShowcase() {
    forkJoin(
      this.HORROR_SHOWCASE_SLUGS.map((slug) =>
        this._scBook.getBySlug(slug).pipe(catchError(() => of(null)))
      )
    )
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((books) => {
        this.horrorShowcase = books.filter((book) => !!book);
      });
  }

  getBooks() {
    this._scBook
      .getFeaturedPrintedBooks()
      .pipe(takeUntil(this._destroySubscribes$), catchError(() => of([] as Book[])))
      .subscribe((books) => {
        this.availableBooks = books;
        this.hasBook = this.availableBooks.length > 0;
      });
  }

  getCategoriesShowcase() {
    this._scBook
      .getCategoriesShowcase()
      .pipe(takeUntil(this._destroySubscribes$), catchError(() => of([] as CategoryShowcase[])))
      .subscribe((showcase) => {
        this.categoriesShowcase = showcase;
      });
  }

  getTopDownloadedEbooks() {
    this._scBook
      .getTopDownloadedEbooks(30)
      .pipe(takeUntil(this._destroySubscribes$), catchError(() => of([] as Book[])))
      .subscribe((books) => {
        this.topDownloadedEbooks = books;
      });
  }

  getEbooks() {
    this._scBook
      .getNewestEbooks()
      .pipe(takeUntil(this._destroySubscribes$), catchError(() => of([] as Book[])))
      .subscribe((ebooks) => {
        this.ebooks = ebooks;
      });

    this._scBook
      .getRecentEbooksCount(7)
      .pipe(takeUntil(this._destroySubscribes$), catchError(() => of(null)))
      .subscribe((response) => {
        this.recentEbooksCount = response?.total || 0;
      });

    this._scBook
      .getAvailableEbooksCount()
      .pipe(takeUntil(this._destroySubscribes$), catchError(() => of(null)))
      .subscribe((response) => {
        this.availableEbooksCount = response?.total || 0;
      });
  }

  getMeetups() {
    // meetups já realizados
    this._scMeetup
      .get(this.meetupsCurrentPage, this.meetupsPerPage)
      .pipe(
        takeUntil(this._destroySubscribes$),
        catchError(() => of({ items: [], totalItems: 0, itemsPerPage: this.meetupsPerPage, page: this.meetupsCurrentPage }))
      )
      .subscribe((meetups) => {
        this.meetups.push(...(meetups.items || []));

        const maxPage = Math.ceil(meetups.totalItems / meetups.itemsPerPage);
        this.showButtonMoreMeetups = this.meetupsCurrentPage < maxPage;
      });
  }

  getMeetupsUpcoming() {
    // próximos meetups
    this._scMeetup
      .get(1, 50, true)
      .pipe(
        takeUntil(this._destroySubscribes$),
        catchError(() => of({ items: [], totalItems: 0, itemsPerPage: 50, page: 1 }))
      )
      .subscribe((meetups) => {
        this.meetupsUpcoming.push(...(meetups.items || []));

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
