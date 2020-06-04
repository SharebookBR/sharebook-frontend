import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public criteria: string;
  public currentPage: number;
  public itemsPerPage: number;

  public books: any;
  isLoading: Boolean = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _bookService: BookService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    this.currentPage = 1;
    this.itemsPerPage = 12;

    this._router.events
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.isLoading = true;
          this.getParamByUri();
          this.getBooks();
        }
      });
  }

  ngOnInit() {
    console.log(1);
    this.getParamByUri();
    console.log(2);
    this.getBooks();
    console.log(3);
  }

  private getParamByUri(): void {
    this._route.params.pipe(takeUntil(this._destroySubscribes$)).subscribe(
      (param) => {
        this.criteria = param['param'];
      },
      (error: HttpErrorResponse) => {
        this._toastr.error(error.message ? error.message : error.toString());
      }
    );
  }

  private getBooks(): void {
    this._bookService
      .getFullSearch(this.criteria, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (books: any[]) => {
          this.books = books;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this._toastr.error(error.message ? error.message : error.toString());
          this.books = null;
          this.isLoading = false;
        },
        () => {}
      );
  }

  public togglePage(currentPage: number): void {
    this.isLoading = true;
    this._bookService
      .getFullSearch(this.criteria, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (books: any[]) => {
          this.books = books;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this._toastr.error(error.message ? error.message : error.toString());
          this.isLoading = false;
        },
        () => {}
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
