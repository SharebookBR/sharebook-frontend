import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ParentAprovalComponent } from './parent-aproval.component';

import { AppConfigModule } from '../../app-config.module';
import { UserService } from '../../core/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ParentAprovalComponent;
  let fixture: ComponentFixture<ParentAprovalComponent>;
  const hashCodeValue = '961bf5da-cdfc-4603-a03b-dcfcbba1e5af';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ParentAprovalComponent],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          AppConfigModule,
          ToastrModule.forRoot(),
          HttpClientTestingModule,
        ],
        providers: [
          UserService,
          {
            provide: ActivatedRoute,
            useValue: { params: of({ hashCodePassword: hashCodeValue }) },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentAprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
