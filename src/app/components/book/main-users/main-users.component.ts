import { Component, OnInit, Input } from '@angular/core';
import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.css']
})
export class MainUsersComponent implements OnInit {

  @Input() bookId;
  @Input() bookTitle;

  isLoading: Boolean;
  mainUsers: UserInfo[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private _scBook: BookService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this._scBook.getMainUsers(this.bookId).subscribe(resp => {
      this.isLoading = false;

      this.mainUsers[0] = !!resp.donor       ? resp.donor       : '';
      this.mainUsers[1] = !!resp.facilitator ? resp.facilitator : '';
      this.mainUsers[2] = !!resp.winner      ? resp.winner      : '';

    },
      error => {
        this.isLoading = false;
      }
    );
  }

}
