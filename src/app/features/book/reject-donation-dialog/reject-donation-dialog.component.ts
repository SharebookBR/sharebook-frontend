import { Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/features/book/services/book.service';

export interface RejectDonationDialogData {
  bookId: string;
  bookTitle: string;
}

@Component({
  selector: 'app-reject-donation-dialog',
  templateUrl: './reject-donation-dialog.component.html',
  styleUrls: ['./reject-donation-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RejectDonationDialogComponent implements OnInit, OnDestroy {
  formGroup: UntypedFormGroup;
  isLoading = false;
  lastError = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<RejectDonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: RejectDonationDialogData
  ) {
    this.formGroup = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  ngOnInit() { }

  reject() {
    if (this.formGroup.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.lastError = '';
    this.bookService.rejectPendingDonation(this.data.bookId, this.formGroup.value.reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          this.lastError = error?.error?.messages?.join(' ') || error?.message || 'Não foi possível reprovar a doação agora.';
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
