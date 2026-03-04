import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../core/services/user/user.service';
import { of } from 'rxjs';

import { MyaccountComponent } from './myaccount.component';

describe('MyaccountComponent', () => {
  let component: MyaccountComponent;
  let fixture: ComponentFixture<MyaccountComponent>;

  beforeEach(async () => {
    const userServiceMock = {
      getProfile: () => of({ profile: 'User' }),
    };

    await TestBed.configureTestingModule({
      declarations: [MyaccountComponent],
      imports: [RouterTestingModule, MatDialogModule],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
