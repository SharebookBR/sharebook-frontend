import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {ToastrService} from 'ngx-toastr';

import * as AppConst from '../../core/utils/app.const';
import {ContactUsService} from '../../core/services/contact-us/contact-us.service';
import {SeoService} from '../../core/services/seo/seo.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  isSent: Boolean;
  isLoading: Boolean = false;
  pageTitle: string;
  private _destroySubscribes$ = new Subject<void>();

  constructor(private _formBuilder: FormBuilder, private _scContactUs: ContactUsService,
              private _toastr: ToastrService, private _seo: SeoService) {
    this.createFormGroup();
  }

  ngOnInit() {
    // TODO: receber mensagem por query string, pra integrar com outras pages.
    this._seo.generateTags({
      title: 'Fale Conosco',
      description: 'Tem alguma dúvida, sugestão de melhoria ou crítica? Entre em contato conosco.' +
        ' É sempre um prazer atendê-lo.Também estamos buscando apoiadores e parceiros pro projeto. ' +
        'Se você conhece alguém, não hesite em entrar em contato. Obrigado.',
      slug: 'fale-conosco'
    });
  }

  createFormGroup() {
    this.formGroup = this._formBuilder.group({
      id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(512)]],
      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }

  onContactUs() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      if (!this.formGroup.value.id) {
        this._scContactUs.contactUs(this.formGroup.value)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(resp => {
          if (resp.success) {
            this.isSent = true;
            this._toastr.success('Mensagem enviada com sucesso!');
            this.pageTitle = 'Obrigado por entrar em contato! ^^ ';
          } else {
            this._toastr.error(resp.messages[0]);
          }
          this.isLoading = false;
        });
      }
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

}
