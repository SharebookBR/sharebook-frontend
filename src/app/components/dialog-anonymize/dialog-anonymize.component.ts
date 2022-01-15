import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from './../../core/services/user/user.service';
import { AnonymizeUserVM } from '../../core/models/AnonymizeUserVM';

@Component({
  selector: 'app-dialog-anonymize',
  templateUrl: './dialog-anonymize.component.html',
  styleUrls: ['./dialog-anonymize.component.css'],
})
export class DialogAnonymizeComponent implements OnInit {
  who: any = [{}];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _scUser: UserService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    public dialog: MatDialog
  ) {
    this.formGroup = this._formBuilder.group({
      password: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(30)]],
    });
  }

  formGroup: FormGroup;
  userData: any;

  ngOnInit(): void {
    this.userData = this._scUser.getLoggedUserFromLocalStorage();
  }

  anonymize() {
    const dto = new AnonymizeUserVM();
    dto.userId = this.userData.userId;
    dto.password = this.formGroup.value.password;
    dto.reason = this.formGroup.value.reason;

    this._scUser.anonymize(dto).subscribe(
      (data) => {
        this.dialog.closeAll();

        // redirecionar para tela de login mata a sessão automaticamente.
        this._router.navigate(['/login']);
        this._toastr.success('Sua conta foi removida com sucesso. =(');
      },
      (error) => {
        this._toastr.error(error[0]);
      }
    );
  }
}
