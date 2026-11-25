import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BookService } from '../services/book.service';
import { CancelDonationDialogComponent } from './cancel-donation-dialog.component';

describe('CancelDonationDialogComponent', () => {
  let component: CancelDonationDialogComponent;
  let bookService: jasmine.SpyObj<BookService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CancelDonationDialogComponent>>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>('BookService', ['cancelDonation']);
    dialogRef = jasmine.createSpyObj<MatDialogRef<CancelDonationDialogComponent>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [CancelDonationDialogComponent],
      imports: [FormsModule, MatButtonModule, MatDialogModule],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { bookId: 'book-1', bookTitle: 'Livro digital', isEbook: true, hasInterestedPeople: false } },
      ]
    }).compileComponents();

    const fixture: ComponentFixture<CancelDonationDialogComponent> = TestBed.createComponent(CancelDonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('requires a message and sends its trimmed version', () => {
    bookService.cancelDonation.and.returnValue(of({ success: true }));
    component.reason = '  Vamos substituir este arquivo por uma edição nova.  ';

    component.cancel();

    expect(bookService.cancelDonation).toHaveBeenCalledWith('book-1', 'Vamos substituir este arquivo por uma edição nova.');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
