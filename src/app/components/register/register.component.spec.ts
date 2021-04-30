import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterComponent } from './register.component';

import { AppConfigModule } from '../../app-config.module';
import { UserService } from '../../core/services/user/user.service';
import { AddressService } from '../../core/services/address/address.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        RouterTestingModule,
        AppConfigModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [UserService, AddressService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
