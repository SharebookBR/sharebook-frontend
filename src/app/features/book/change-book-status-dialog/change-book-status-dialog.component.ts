import { Component, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookDonationStatus } from 'src/app/features/book/BookDonationStatus';
import { getStatusDescription } from 'src/app/features/book/getStatusDescription';
import { BookService } from 'src/app/features/book/services/book.service';

export interface ChangeBookStatusDialogData {
  bookId: string;
  bookTitle: string;
  currentStatus: BookDonationStatus;
  allowedNewStatuses: BookDonationStatus[];
}

@Component({
  selector: 'app-change-book-status-dialog',
  templateUrl: './change-book-status-dialog.component.html',
  styleUrls: ['./change-book-status-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ChangeBookStatusDialogComponent implements OnDestroy {
  isLoading = false;
  lastError = '';
  readonly form: UntypedFormGroup;
  readonly currentStatusDescription: string;
  readonly statusOptions: { value: BookDonationStatus; label: string }[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<ChangeBookStatusDialogComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly data: ChangeBookStatusDialogData
  ) {
    this.currentStatusDescription = getStatusDescription(data.currentStatus);
    this.statusOptions = data.allowedNewStatuses.map(status => ({ value: status, label: getStatusDescription(status) }));
    this.form = this.formBuilder.group({
      newStatus: [data.allowedNewStatuses[0] ?? null, Validators.required],
      reason: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]]
    });
  }

  changeStatus() {
    if (this.isLoading || this.form.invalid) return;

    this.isLoading = true;
    this.lastError = '';
    this.bookService.changeStatus(this.data.bookId, this.form.value.newStatus, this.form.value.reason.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          this.lastError = error?.error?.messages?.join(' ') || error?.message || 'Não foi possível alterar o status agora.';
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
