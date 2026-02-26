import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { MyRequestItem } from './../../../core/models/MyRequestItem';
import { BookService } from '../../../core/services/book/book.service';
import { BookRequestStatus, getStatusDescription } from '../../../core/models/BookRequestStatus';
import { MyRequest } from 'src/app/core/models/MyRequest';
import { DonorModalComponent } from '../donor-modal/donor-modal.component';

const COLUMNS_DESKTOP = ['title', 'author', 'status', 'doador'];
const COLUMNS_MOBILE = ['livro', 'doador'];

@Component({
  selector: 'app-requesteds',
  templateUrl: './requesteds.component.html',
  styleUrls: ['./requesteds.component.css'],
})
export class RequestedsComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = COLUMNS_DESKTOP;
  public requestedBooks = new MatTableDataSource<MyRequestItem>();
  private _messageToModalBody: string;
  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private _bookService: BookService, public dialog: MatDialog, private _breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this._breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(result => {
        this.displayedColumns = result.matches ? COLUMNS_MOBILE : COLUMNS_DESKTOP;
      });
    this.buscarDados();
  }

  private buscarDados() {
    this.isLoadingSubject.next(true);
    this._bookService
      .getRequestedBooks(1, 9999)
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false))
      )
      .subscribe((resp: MyRequest) => {
        this.requestedBooks.data = resp.items;
      });
  }

  public getTranslatedStatusDescription(status: string): string {
    return getStatusDescription(status);
  }

  public getStatusBadgeBackgroundColor(status) {
    switch (status) {
      case BookRequestStatus.DONATED:
        return '#28a745'; // success
      case BookRequestStatus.REFUSED:
        return '#dc3545'; // danger
      default:
        return '#fff'; // light
    }
  }

  public getStatusBadgeTextColor(status) {
    switch (status) {
      case BookRequestStatus.DONATED:
        return '#fff';
      case BookRequestStatus.REFUSED:
        return '#fff';
      default:
        return '#414141';
    }
  }

  onCustomActionColum(iconClicked: string, param: MyRequestItem) {
    if (iconClicked === 'verDoador') {
      this.showDonor(param);
    } else {
      this.cancelRequest(param);
    }
  }

  private showDonor(param: MyRequestItem) {
    this._messageToModalBody = '';

    const modalRef = this.dialog.open(DonorModalComponent, { minWidth: 450 });

    modalRef.componentInstance.bookId = param.bookId;
    modalRef.componentInstance.bookTitle = param.title;
    modalRef.componentInstance.messageBody = this._messageToModalBody;
  }

  private cancelRequest(param: MyRequestItem) {
    const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: 450,
      data: {
        title: 'Cancelar pedido',
        message: `Tem certeza que quer cancelar o pedido do livro "${param.title}"?`,
        btnOkText: 'Sim, cancelar',
        btnCancelText: 'Não, manter pedido',
      },
    });

    confirmRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.isLoadingSubject.next(true);
      this._bookService
        .cancelRequest(param.requestId)
        .pipe(
          takeUntil(this._destroySubscribes$),
          finalize(() => {
            this.isLoadingSubject.next(false);
            this.buscarDados();
          })
        )
        .subscribe();
    });
  }

  public doFilter = (value: string) => {
    this.requestedBooks.filter = value.trim().toLocaleLowerCase();
  };

  public showIconCancel(param: MyRequestItem) {
    return param.status === BookRequestStatus.AWAITING_ACTION;
  }

  public showIconDonor(param: MyRequestItem) {
    return param.status === BookRequestStatus.DONATED;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
