import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { BookService } from '../../core/services/book/book.service';
import { GoogleAnalyticsService } from '../../core/services/analytics/google-analytics.service';
import { FullSearchItem } from 'src/app/core/models/FullSearchItem';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public criteria: string;
  public isLoading = true;
  public books: FullSearchItem[] = [];

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _toastr: ToastrService,
    private _scBook: BookService,
    private _ga: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.getParamByUri();
  }

  searchBooks() {
    this.isLoading = true;
    this._scBook
      .getFullSearch(this.criteria, 1, 100)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((result) => {
        this.books = (result?.items || []).filter(b => b.status === BookDonationStatus.AVAILABLE);
        this.isLoading = false;
        this._ga.sendEvent('search', {
          search_term: this.criteria,
          results_count: this.books.length,
        });
      });
  }

  getAmazonLink(): string {
    const query = encodeURIComponent(this.criteria.trim());
    return `https://www.amazon.com.br/s?k=${query}&tag=sharebook09-20`;
  }

  onAmazonClick(): void {
    this._ga.sendEvent('amazon_click', {
      book_title: this.criteria,
      book_slug: null,
    });
  }

  private getParamByUri(): void {
    this._route.params.pipe(takeUntil(this._destroySubscribes$)).subscribe(
      (param) => {
        this.criteria = param['criteria'];
        this.searchBooks();
      },
      (error: HttpErrorResponse) => {
        this._toastr.error(error.message ? error.message : error.toString());
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
