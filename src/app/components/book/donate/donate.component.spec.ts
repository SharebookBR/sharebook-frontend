import { ToastrModule } from 'ngx-toastr';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

import { DonateComponent } from './donate.component';

import { AppConfigModule } from '../../../app-config.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DonateComponent', () => {
  let component: DonateComponent;
  let fixture: ComponentFixture<DonateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DonateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        Ng2SmartTableModule,
        AppConfigModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [NgbActiveModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
