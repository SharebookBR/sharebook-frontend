import { Component, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from 'src/app/features/book/services/book.service';

export interface ChooseAnotherWinnerDialogData {
  bookId: string;
  bookTitle: string;
}

@Component({
  selector: 'app-choose-another-winner-dialog',
  templateUrl: './choose-another-winner-dialog.component.html',
  styleUrls: ['./choose-another-winner-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ChooseAnotherWinnerDialogComponent implements OnDestroy {
  isLoading = false;
  lastError = '';
  readonly form: UntypedFormGroup;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<ChooseAnotherWinnerDialogComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly data: ChooseAnotherWinnerDialogData
  ) {
    this.form = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(600)]]
    });
  }

  chooseAnotherWinner() {
    if (this.isLoading || this.form.invalid) return;

    this.isLoading = true;
    this.lastError = '';
    this.bookService.chooseAnotherWinner(this.data.bookId, this.form.value.reason.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => {
          this.lastError = error?.error?.messages?.join(' ') || error?.message || 'Não foi possível refazer a escolha agora.';
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
