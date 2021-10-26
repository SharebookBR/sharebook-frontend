import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { DetailsComponent } from './details.component';

import { AppConfigModule } from '../../../app-config.module';
import { UserService } from '../../../core/services/user/user.service';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { FormsModule } from '@angular/forms';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [
        RouterTestingModule,
        AppConfigModule,
        MatDialogModule,
        HttpClientTestingModule,
        FormsModule,
      ],
      providers: [UserService, AuthenticationService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
