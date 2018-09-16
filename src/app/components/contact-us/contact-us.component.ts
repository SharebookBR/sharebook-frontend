import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import * as AppConst from '../../core/utils/app.const';
import { ContactUsService } from '../../core/services/contact-us/contact-us.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})


export class ContactUsComponent implements OnInit {
  formGroup: FormGroup;
  isSaved: Boolean;
  isLoading: Boolean = false;
  pageTitle: string;

  constructor(private _formBuilder: FormBuilder, private _scContactUs: ContactUsService, private _scAlert: AlertService) {
    this.createFormGroup();
   }

  ngOnInit() {}

  createFormGroup() {
    this.formGroup = this._formBuilder.group({
      id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['',  [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(512)]],
      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }

  onContactUs() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      if (!this.formGroup.value.id) {
        this._scContactUs.contactUs(this.formGroup.value, '').subscribe(resp => {
          if (resp.success) {
            this.isSaved = true;
            this._scAlert.success('Mensagem enviada com sucesso!');
            this.pageTitle = 'Obrigado por entrar em contato! ^^ ';
          } else {
            this._scAlert.error(resp.messages[0]);
          }
          this.isLoading = false;
        });
      }
    }
  }
}




