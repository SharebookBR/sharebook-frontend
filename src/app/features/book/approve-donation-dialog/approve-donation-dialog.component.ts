import { Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/features/book/services/book.service';
import { todaySaoPaulo } from 'src/app/core/utils/release-date';

export interface ApproveDonationDialogData {
  bookId: string;
  bookTitle: string;
  isEbook: boolean;
}

function addDaysToIsoDate(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function publicationDateValidator(minDate: string): ValidatorFn {
  return (control) => !control.value || control.value >= minDate ? null : { publicationDateBeforeMin: true };
}

@Component({
  selector: 'app-approve-donation-dialog',
  templateUrl: './approve-donation-dialog.component.html',
  styleUrls: ['./approve-donation-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ApproveDonationDialogComponent implements OnInit, OnDestroy {
  readonly minPublicationDate = addDaysToIsoDate(todaySaoPaulo(), 1);
  formGroup: UntypedFormGroup;
  isLoading = false;
  lastError = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<ApproveDonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ApproveDonationDialogData
  ) {
    this.formGroup = this.formBuilder.group({
      publishImmediately: [true],
      releaseDate: [null]
    });
  }

  ngOnInit(): void {
    this.formGroup.controls.publishImmediately.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateReleaseDateValidation());

    this.updateReleaseDateValidation();
  }

  approve(): void {
    if (this.formGroup.invalid || this.isLoading) {
      return;
    }

    const releaseDate = this.isPublishingImmediately ? null : this.formGroup.value.releaseDate;
    this.isLoading = true;
    this.lastError = '';

    this.bookService.approve(this.data.bookId, releaseDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          this.lastError = error?.error?.messages?.join(' ') || error?.message || 'Não foi possível aprovar a doação agora.';
          this.isLoading = false;
        }
      });
  }

  get isPublishingImmediately(): boolean {
    return this.data.isEbook || this.formGroup.value.publishImmediately;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateReleaseDateValidation(): void {
    const releaseDateControl = this.formGroup.controls.releaseDate;
    if (this.isPublishingImmediately) {
      releaseDateControl.clearValidators();
      releaseDateControl.setValue(null, { emitEvent: false });
    } else {
      releaseDateControl.setValidators([Validators.required, publicationDateValidator(this.minPublicationDate)]);
    }
    releaseDateControl.updateValueAndValidity({ emitEvent: false });
  }
}
