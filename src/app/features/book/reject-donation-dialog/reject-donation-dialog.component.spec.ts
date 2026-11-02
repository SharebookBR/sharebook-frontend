import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { BookService } from '../services/book.service';
import { RejectDonationDialogComponent } from './reject-donation-dialog.component';

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
      imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { bookId: 'book-1', bookTitle: 'Livro digital' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RejectDonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends the custom reason and closes the dialog when the rejection succeeds', () => {
    bookService.rejectPendingDonation.and.returnValue(of({ success: true }));
    component.formGroup.controls.reason.setValue('A obra não possui autorização para redistribuição.');

    component.reject();

    expect(bookService.rejectPendingDonation).toHaveBeenCalledWith(
      'book-1',
      'A obra não possui autorização para redistribuição.'
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
