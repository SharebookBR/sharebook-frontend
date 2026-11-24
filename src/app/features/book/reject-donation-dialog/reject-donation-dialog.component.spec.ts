import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { BookService } from '../services/book.service';
import { DEFAULT_EBOOK_REJECTION_REASON, RejectDonationDialogComponent } from './reject-donation-dialog.component';

describe('RejectDonationDialogComponent', () => {
  let component: RejectDonationDialogComponent;
  let fixture: ComponentFixture<RejectDonationDialogComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<RejectDonationDialogComponent>>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>('BookService', ['rejectPendingDonation']);
    dialogRef = jasmine.createSpyObj<MatDialogRef<RejectDonationDialogComponent>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [RejectDonationDialogComponent],
      imports: [FormsModule, MatButtonModule, MatDialogModule],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { bookId: 'book-1', bookTitle: 'Livro digital', isEbook: true } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RejectDonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('prefills the digital reason and sends the reviewed message when the rejection succeeds', () => {
    bookService.rejectPendingDonation.and.returnValue(of({ success: true }));

    expect(component.reason).toBe(DEFAULT_EBOOK_REJECTION_REASON);
    component.reason = '  A edição enviada não possui autorização para redistribuição.  ';

    component.reject();

    expect(bookService.rejectPendingDonation).toHaveBeenCalledWith(
      'book-1',
      'A edição enviada não possui autorização para redistribuição.'
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('starts blank for a physical donation and does not submit without a message', () => {
    (component.data as any).isEbook = false;
    component.ngOnInit();

    component.reject();

    expect(component.reason).toBe('');
    expect(bookService.rejectPendingDonation).not.toHaveBeenCalled();
  });
});
