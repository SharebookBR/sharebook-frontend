import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigModule } from './../../../app-config.module';
import { AddressService } from './../../../core/services/address/address.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DonatePageComponent } from './donate-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DonatePageComponent', () => {
  let component: DonatePageComponent;
  let fixture: ComponentFixture<DonatePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DonatePageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AppConfigModule,
        HttpClientTestingModule,
      ],
      providers: [AddressService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
