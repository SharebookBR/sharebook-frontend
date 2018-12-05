import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { RequestComponent } from './request.component';

import { AppConfigModule } from '../../../app-config.module';
import { UserService } from '../../../core/services/user/user.service';
import { AlertService } from '../../../core/services/alert/alert.service';

describe('RequestComponent', () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        NgbModalModule,
        Ng2SmartTableModule,
        AppConfigModule,
        RouterTestingModule
      ],
      providers: [
        NgbActiveModal,
        HttpClient,
        HttpHandler,
        UserService,
        AlertService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
