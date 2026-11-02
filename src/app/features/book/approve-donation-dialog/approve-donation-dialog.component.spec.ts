import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BookService } from '../services/book.service';
import { ApproveDonationDialogComponent } from './approve-donation-dialog.component';

describe('ApproveDonationDialogComponent', () => {
  let component: ApproveDonationDialogComponent;
  let fixture: ComponentFixture<ApproveDonationDialogComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ApproveDonationDialogComponent>>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>('BookService', ['approve']);
    dialogRef = jasmine.createSpyObj<MatDialogRef<ApproveDonationDialogComponent>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ApproveDonationDialogComponent],
      imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { bookId: 'book-1', bookTitle: 'Livro físico', isEbook: false } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveDonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('publishes immediately by default', () => {
    bookService.approve.and.returnValue(of({ success: true }));

    component.approve();

    expect(bookService.approve).toHaveBeenCalledWith('book-1', null);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('requires and sends a future publication date when immediate publishing is disabled', () => {
    component.formGroup.controls.publishImmediately.setValue(false);
    component.formGroup.controls.releaseDate.setValue(component.minPublicationDate);
    bookService.approve.and.returnValue(of({ success: true }));

    component.approve();

    expect(bookService.approve).toHaveBeenCalledWith('book-1', component.minPublicationDate);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
