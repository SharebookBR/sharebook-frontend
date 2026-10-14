import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/features/book/services/book.service';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'app-admin-notes',
    templateUrl: './admin-notes.component.html',
    styleUrls: ['./admin-notes.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminNotesComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;
  @Input() adminNotes;

  formGroup: UntypedFormGroup;
  isLoading: Boolean;

  state = 'loading'; // loading, form, error
  lastError: string;

  private _destroySubscribes$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<AdminNotesComponent>, private _scBook: BookService, private _formBuilder: UntypedFormBuilder) {

    this.formGroup = _formBuilder.group({
      bookId: '',
      adminNotes: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const adminNotesForUpdate = {
      bookId: this.bookId,
      adminNotes: ''
    };
    this.formGroup.setValue(adminNotesForUpdate);
  }

  onTracking() {
    this.isLoading = true;
    this._scBook.setAdminNotes(this.formGroup.value)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error => {
          this.lastError = error;
          this.state = 'request-error';
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
