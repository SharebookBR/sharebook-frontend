/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { ForgotPasswordComponent } from './forgot-password.component';

import { AppConfigModule } from '../../app-config.module';
import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ForgotPasswordComponent
       ],
       imports: [
         FormsModule,
         ReactiveFormsModule,
         RouterTestingModule,
         AppConfigModule
       ],
       providers: [
         UserService,
         HttpClient,
         HttpHandler,
         AlertService
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
