import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactUsComponent } from './contact-us.component';

import { AppConfigModule } from '../../app-config.module';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactUsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        RecaptchaModule,
        RecaptchaFormsModule,
        AppConfigModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
