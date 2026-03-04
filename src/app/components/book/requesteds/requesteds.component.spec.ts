import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

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
  };

  const breakpointObserverMock = {
    observe: () => of({ matches: false }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestedsComponent],
      imports: [MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
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
});
