import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';

import { User } from '../../core/models/user';
import { UserService } from "../../core/services/user/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {

  private _subscription: Subscription;

  userLogged = false;
  shareBookUser = new User();

  constructor(private _scUser: UserService) {

    //if has shareBookUser, set value to variables
    if (localStorage.getItem('shareBookUser')) {      
      this.shareBookUser = JSON.parse(localStorage.getItem('shareBookUser'));
      this.userLogged = true;
    }

  }

  ngOnInit() {
    this._subscription = this._scUser.getLoggedUser().subscribe(shareBookUser => {
      console.log(shareBookUser)
      this.shareBookUser = shareBookUser;
      if (this.shareBookUser) {
        this.userLogged = true;
      } else {
        this.userLogged = false;
      }
    });
  }
}
