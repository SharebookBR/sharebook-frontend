import { Component, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/features/book/services/book.service';

export interface CancelDonationDialogData {
  bookId: string;
  bookTitle: string;
  isEbook: boolean;
  hasInterestedPeople: boolean;
}

@Component({
  selector: 'app-cancel-donation-dialog',
  templateUrl: './cancel-donation-dialog.component.html',
  styleUrls: ['./cancel-donation-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class CancelDonationDialogComponent implements OnDestroy {
  readonly maxReasonLength = 2000;

  isLoading = false;
  lastError = '';
  reason = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<CancelDonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: CancelDonationDialogData
  ) { }

  cancel(): void {
    const normalizedReason = this.reason.trim();
    if (this.isLoading || !normalizedReason || normalizedReason.length > this.maxReasonLength) {
      return;
    }

    this.isLoading = true;
    this.lastError = '';
    this.bookService.cancelDonation(this.data.bookId, normalizedReason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          this.lastError = error?.error?.messages?.join(' ') || error?.message || 'Não foi possível concluir o cancelamento agora.';
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
