import { Component, OnInit } from '@angular/core';

import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  isAdmin: boolean;

  constructor(private _scUser: UserService) { }

  ngOnInit() {

    this._scUser.getProfile().subscribe(({ profile }) =>
      this.isAdmin = (profile === 'Administrator') ? true : false
    );
  }
}
