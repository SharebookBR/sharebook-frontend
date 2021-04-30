import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { RequestComponent } from './request.component';

import { AppConfigModule } from '../../../app-config.module';
import { UserService } from '../../../core/services/user/user.service';

describe('RequestComponent', () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        NgbModalModule,
        Ng2SmartTableModule,
        AppConfigModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [NgbActiveModal, UserService],
    }).compileComponents();
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
