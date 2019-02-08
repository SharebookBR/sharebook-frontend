import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskModule } from 'ngx-mask';
import { ContactUsPageComponent } from './contact-us-page.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

const CONTACTUS_ROUTES: Routes = [
  {
    path: '',
    component: ContactUsPageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CONTACTUS_ROUTES),
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    Ng2ImgMaxModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [ContactUsPageComponent],
  providers: [
    { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: '6LcxaXAUAAAAAGM8zgwQvgMuykwiBPgMr0P7sNL3' } as RecaptchaSettings }
  ]
})
export class ContactUsPageModule { }
