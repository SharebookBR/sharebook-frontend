import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfoBook } from 'src/app/core/models/UserInfoBook';

@Component({
  selector: 'app-donor-modal',
  templateUrl: './donor-modal.component.html',
  styleUrls: ['./donor-modal.component.css']
})
export class DonorModalComponent implements OnInit {
  @Input() bookId;
  @Input() bookTitle;
  @Input() messageBody;
  loading: boolean;

  userInfo$: Observable<UserInfoBook>;

  constructor(public dialogRef: MatDialogRef<DonorModalComponent>,
    private readonly _bookService: BookService) { }

  ngOnInit() {
    this.loading = true;
    if (this.messageBody === '') {
      this.getDonor();
    } else {
      this.loading = false;
    }
  }

  private getDonor() {

    this.userInfo$ = this._bookService.getMainUsers(this.bookId).pipe(
      map(userInfo => {
        this.loading = false;
        return userInfo;
      })
    );
  }
}
