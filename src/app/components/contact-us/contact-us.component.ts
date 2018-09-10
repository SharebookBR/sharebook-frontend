
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import * as AppConst from '../../core/utils/app.const';




@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})


export class ContactUsComponent implements OnInit {

  formGroup : FormGroup;
  isSaved: Boolean;
  isLoading: Boolean = false;

  constructor(private _formBuilder: FormBuilder
  ) {
    this.createFormGroup();
   }

  ngOnInit() {}

  createFormGroup() {
    this.formGroup = this._formBuilder.group({
      id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['',  [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(512)]],
    });
  }

  onContactUs() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      if (!this.formGroup.value.id) {
        // this._scBook.create(this.formGroup.value).subscribe(resp => {
        //   if (resp.success) {
        //     this.isSaved = true;
        //     this._scAlert.success('Livro cadastrado com sucesso!');
        //     this.pageTitle = 'Obrigado por ajudar <3.';
        //   } else {
        //     this._scAlert.error(resp.messages[0]);
        //   }
        //   this.isLoading = false;
        // }
        // );
      } else {
        // this._scBook.update(this.formGroup.value).subscribe(resp => {
        //   this.isSaved = true;
        //   this.pageTitle = 'Registro atualizado';
        //   this.isLoading = false;
        // }
        // );
      }
    }
  }
}




