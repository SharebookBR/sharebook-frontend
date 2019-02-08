import { BookService } from 'src/app/core/services/book/book.service';
import { Book } from './../../core/models/book';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  top15NewBooks: Book[] = [];
  random15NewBooks: Book[] = [];

  constructor(private _scBook: BookService) {}

  ngOnInit() {
    this.showTopNewBooks();
    this.showRandonBooks();
  }

  public showTopNewBooks(): void {
    this._scBook.getTop15NewBooks().subscribe(data => (this.top15NewBooks = data));
  }

  public showRandonBooks(): void {
    this._scBook.getRandom15Books().subscribe(data => (this.random15NewBooks = data));
  }

}
