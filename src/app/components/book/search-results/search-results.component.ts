import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/core/services/book/book.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public criteria: string;
  public page: number;
  public items: number;

  public books: any[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _bookService: BookService
  ) {
    this.page = 1;
    this.items = 12;
  }

  ngOnInit() {
    console.log('Search Component');
    this.getParamByUri();
    this.getBooks();
  }

  private getParamByUri(): void {
    this._route.params.subscribe(param => {
      this.criteria = param['param'];
    }, (error: HttpErrorResponse) => {
      console.log('Algum erro ao buscar o parâmetro', error);
    });
  }

  private getBooks(): void {
    this._bookService.getFullSearch(
      this.criteria,
      this.page,
      this.items
      ).subscribe(
        (books: any[]) => this.books = books,
        (error: HttpErrorResponse) => {
          console.log('Algum erro ao buscar o parâmetro', error);
        }, () => {
        }
    );
  }

}
