import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/core/services/book/book.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-facilitator-notes',
  templateUrl: './facilitator-notes.component.html',
  styleUrls: ['./facilitator-notes.component.css']
})
export class FacilitatorNotesComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;
  @Input() facilitatorNotes;

  formGroup: FormGroup;
  isLoading: Boolean;

  state = 'loading'; // loading, form, error
  lastError: string;

  private _destroySubscribes$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<FacilitatorNotesComponent>, private _scBook: BookService, private _formBuilder: FormBuilder) {

    this.formGroup = _formBuilder.group({
      bookId: '',
      facilitatorNotes: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const facilitatorNotesForUpdate = {
      bookId: this.bookId,
      facilitatorNotes: ''
    };
    this.formGroup.setValue(facilitatorNotesForUpdate);
  }

  onTracking() {
    this.isLoading = true;
    this._scBook.setFacilitatorNotes(this.formGroup.value)
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
