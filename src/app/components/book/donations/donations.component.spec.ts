import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { DonationsComponent } from './donations.component';

import { AppConfigModule } from '../../../app-config.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DonationsComponent', () => {
  let component: DonationsComponent;
  let fixture: ComponentFixture<DonationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DonationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        AppConfigModule,
        MatSortModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
