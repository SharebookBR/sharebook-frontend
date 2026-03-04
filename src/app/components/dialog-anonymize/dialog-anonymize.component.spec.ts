import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import { DialogAnonymizeComponent } from './dialog-anonymize.component';
import { UserService } from '../../core/services/user/user.service';

describe('DialogWHoAccessedComponent', () => {
  let component: DialogAnonymizeComponent;
  let fixture: ComponentFixture<DialogAnonymizeComponent>;

  beforeEach(async () => {
    const userServiceMock = {
      getLoggedUserFromLocalStorage: () => ({ userId: 'user-id' }),
      anonymize: () => ({ subscribe: () => null }),
    };

    await TestBed.configureTestingModule({
      declarations: [DialogAnonymizeComponent],
      imports: [MatDialogModule, ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UserService, useValue: userServiceMock },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['closeAll']) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAnonymizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
