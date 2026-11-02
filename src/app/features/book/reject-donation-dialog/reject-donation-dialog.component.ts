import { Component, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/features/book/services/book.service';

export interface RejectDonationDialogData {
  bookId: string;
  bookTitle: string;
}

export const DEFAULT_REJECTION_REASON = `Não conseguimos aprovar esta doação porque o livro é uma obra comercial protegida por direitos autorais e não temos autorização para distribuí-la digitalmente.

Para respeitar autores, editoras e a legislação, cancelamos a doação. Obras autorais, em domínio público ou com licença explícita de distribuição são sempre bem-vindas.

Obrigada pela compreensão.`;

@Component({
  selector: 'app-reject-donation-dialog',
  templateUrl: './reject-donation-dialog.component.html',
  styleUrls: ['./reject-donation-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RejectDonationDialogComponent implements OnDestroy {
  isLoading = false;
  lastError = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<RejectDonationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: RejectDonationDialogData
  ) { }

  reject() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.lastError = '';
    this.bookService.rejectPendingDonation(this.data.bookId, DEFAULT_REJECTION_REASON)
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
