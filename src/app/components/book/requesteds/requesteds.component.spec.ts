import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { RequestedsComponent } from './requesteds.component';
import { BookService } from '../../../core/services/book/book.service';
import { DonorModalComponent } from '../donor-modal/donor-modal.component';

describe('RequestedsComponent', () => {
  let component: RequestedsComponent;
  let fixture: ComponentFixture<RequestedsComponent>;
  let dialog: MatDialog;

  const bookServiceMock = {
    getRequestedBooks: () => of({ items: [] }),
    cancelRequest: () => of({}),
    markAsDelivered: () => of({}),
  };

  const toastrMock = {
    success: jasmine.createSpy('success'),
    info: jasmine.createSpy('info'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestedsComponent],
      imports: [MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    spyOn(dialog, 'open').and.returnValue({ componentInstance: {} } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open donor modal when action is verDoador', () => {
    component.onCustomActionColum('verDoador', {
      bookId: 'book-id',
      title: 'Livro X',
    } as any);

    expect(dialog.open).toHaveBeenCalledWith(DonorModalComponent, { minWidth: 450 });
  });

  it('should return tracking number only when status is Donated', () => {
    const donatedItem = { status: 'Donated', trackingNumber: 'BR123456789' } as any;
    const pendingItem = { status: 'Requested', trackingNumber: 'BR000000000' } as any;

    expect(component.getTrackingNumber(donatedItem)).toBe('BR123456789');
    expect(component.getTrackingNumber(pendingItem)).toBeNull();
  });

  it('should return null when donated request has empty tracking number', () => {
    const donatedWithoutTracking = { status: 'Donated', trackingNumber: '   ' } as any;

    expect(component.getTrackingNumber(donatedWithoutTracking)).toBeNull();
  });

  it('should allow mark as received when donated and not received yet', () => {
    expect(component.canMarkAsReceived({ status: 'Donated', bookStatus: 'Sent' } as any)).toBeTrue();
    expect(component.canMarkAsReceived({ status: 'Donated', bookStatus: 'Received' } as any)).toBeFalse();
    expect(component.canMarkAsReceived({ status: 'WaitingAction', bookStatus: 'Sent' } as any)).toBeFalse();
  });
  it('should render canceled status badge with danger colors', () => {
    expect(component.getStatusBadgeBackgroundColor('Canceled')).toBe('#dc3545');
    expect(component.getStatusBadgeTextColor('Canceled')).toBe('#fff');
  });
});
