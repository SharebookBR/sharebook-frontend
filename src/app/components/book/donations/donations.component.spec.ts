import { ToastrModule } from 'ngx-toastr';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { DonationsComponent } from './donations.component';

import { AppConfigModule } from '../../../app-config.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DonationsComponent', () => {
  let component: DonationsComponent;
  let fixture: ComponentFixture<DonationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DonationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        Ng2SmartTableModule,
        AppConfigModule,
        NgbModule,
        NgbModalModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [ConfirmationDialogService],
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
