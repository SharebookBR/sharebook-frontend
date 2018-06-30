import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { UserService } from '../../core/services/user/user.service'
import { User } from '../../core/models/user'

@Component({
  selector: 'app-form',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private _scUser: UserService,
    private _formBuilder: FormBuilder
  ) { 
    this.formGroup = _formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      passwordSalt: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      linkedin: ['', []],
      postalCode: ['', [Validators.required]]
    })
  }

  ngOnInit() {
  }

  registerUser() {
    if (this.formGroup.valid) {
      this._scUser.register(this.formGroup.value).subscribe();
    }
  }

}
