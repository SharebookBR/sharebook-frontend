import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FullSearch } from './../../../core/models/FullSearch';
import { BookService } from 'src/app/core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';
import { FullSearchItem } from 'src/app/core/models/FullSearchItem';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  public criteria: string;
  public currentPage: number;
  public itemsPerPage: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public books: FullSearch;
  public bookItens = new MatTableDataSource<FullSearchItem>();

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
  }

  ngOnInit() {
    this.getParamByUri();
    this.getBooks();
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
        (books: FullSearch) => {
          this.books = books;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this._toastr.error(error.message ? error.message : error.toString());
          this.books = null;
          this.isLoading = false;
        },
        () => { }
      );
  }

  public togglePage(pagination: PageEvent): void {

    const currentPage = pagination.pageIndex + 1;

    this.isLoading = true;
    this._bookService
      .getFullSearch(this.criteria, currentPage, pagination.pageSize)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (books: FullSearch) => {
          this.books = books;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this._toastr.error(error.message ? error.message : error.toString());
          this.isLoading = false;
        },
        () => { }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
