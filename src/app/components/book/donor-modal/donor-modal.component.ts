import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfoBook } from 'src/app/core/models/UserInfoBook';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-donor-modal',
  templateUrl: './donor-modal.component.html',
  styleUrls: ['./donor-modal.component.css']
})
export class DonorModalComponent implements OnInit {
  @Input() bookId;
  @Input() bookTitle;

  showDonor = false;
  userInfo$: Observable<UserInfoBook>;

  constructor(public activeModal: NgbActiveModal,
    private readonly _bookService: BookService,
    private readonly _userService: UserService) { }

  ngOnInit() {
    this.userInfo$ = this._bookService.getMainUsers(this.bookId).pipe(
      map(userInfo => {

        const loggedUser = this.getLoggedUser();
        if (loggedUser.email === userInfo.winner.email) {
          this.showDonor = true;
        }

        return userInfo;
      })
    );
  }

  private getLoggedUser(): User {
    let loggedUser = new User();
    if (this._userService.getLoggedUserFromLocalStorage()) {
      loggedUser = this._userService.getLoggedUserFromLocalStorage();
    }
    return loggedUser;
  }
}
