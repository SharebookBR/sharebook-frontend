import { Component, OnInit, Input } from '@angular/core';
import { BookService } from 'src/app/core/services/book/book.service';

@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.css']
})
export class MainUsersComponent implements OnInit {

  @Input() bookId;
  @Input() bookTitle;

  isLoading: Boolean;

  constructor(
    private _scBook: BookService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this._scBook.getMainUsers(this.bookId).subscribe(resp => {
      this.isLoading = false;
      console.log(resp);
    },
      error => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

}
