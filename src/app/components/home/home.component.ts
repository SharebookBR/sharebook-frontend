import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/models/book';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public top15NewBooks: Book[] = [];
  public random15NewBooks: Book[] = [];
  public hasBook: Boolean = true;


  constructor(
    private _scBook: BookService
  ) { }

  ngOnInit() {
    this._scBook.getTop15NewBooks().subscribe(newBooks => {
      this.top15NewBooks = newBooks;
      this.hasBook = (newBooks.length > 0 ? true : false);

      /*if (this.hasBook) {
        this._scBook.getRandom15Books().subscribe(randomBooks => {
          this.random15NewBooks = randomBooks;
        });
      }*/
    });
  }


}
