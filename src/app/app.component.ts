import { Component, OnInit } from '@angular/core';
import moment from 'moment-timezone';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../style.scss']
})
export class AppComponent implements OnInit {
  localStorageUserKey = 'shareBookUser';

  ngOnInit() {
    this.checkTokenValidity();
  }

  checkTokenValidity() {
    const user = JSON.parse(localStorage.getItem(this.localStorageUserKey));
    if (user) {
      const expiration = moment(user.expiration);
      const now = moment();
      if (now.isAfter(expiration)) {
        localStorage.setItem(this.localStorageUserKey, null);
      }
    }
  }
}
