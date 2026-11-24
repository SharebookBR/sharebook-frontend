import { Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/features/book/services/book.service';

export interface RejectDonationDialogData {
  bookId: string;
  bookTitle: string;
  isEbook: boolean;
}

export const DEFAULT_EBOOK_REJECTION_REASON = `Não conseguimos aprovar esta doação porque o livro é uma obra comercial protegida por direitos autorais e não temos autorização para distribuí-la digitalmente.

Para respeitar autores, editoras e a legislação, cancelamos a doação. Obras autorais, em domínio público ou com licença explícita de distribuição são sempre bem-vindas.

Obrigada pela compreensão.`;

@Component({
  selector: 'app-reject-donation-dialog',
  templateUrl: './reject-donation-dialog.component.html',
  styleUrls: ['./reject-donation-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RejectDonationDialogComponent implements OnInit, OnDestroy {
  readonly maxReasonLength = 2000;

  isLoading = false;
  lastError = '';
  reason = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<RejectDonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: RejectDonationDialogData
  ) { }

  ngOnInit() {
    this.reason = this.data.isEbook ? DEFAULT_EBOOK_REJECTION_REASON : '';
  }

  reject() {
    const normalizedReason = this.reason.trim();
    if (this.isLoading || !normalizedReason || normalizedReason.length > this.maxReasonLength) {
      return;
    }

    this.isLoading = true;
    this.lastError = '';
    this.bookService.rejectPendingDonation(this.data.bookId, normalizedReason)
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
