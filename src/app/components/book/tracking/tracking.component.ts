import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/core/services/book/book.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;
  @Input() trackingNumber;

  formGroup: FormGroup;
  isLoading: Boolean;

  state = 'loading'; // loading, form, error
  lastError: string;

  private _destroySubscribes$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<TrackingComponent>, private _scBook: BookService, private _formBuilder: FormBuilder) {
    this.formGroup = _formBuilder.group({
      trackingNumber: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (!!this.trackingNumber) {
      const trackingNumberForUpdate = {
        trackingNumber: this.trackingNumber
      };
      this.formGroup.setValue(trackingNumberForUpdate);
    }
  }

  onTracking() {
    this.isLoading = true;
    this._scBook.setTrackingNumber(this.bookId, this.formGroup.value)
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
