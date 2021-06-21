import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { MyRequestItem } from './../../../core/models/MyRequestItem';
import { BookService } from '../../../core/services/book/book.service';
import { BookRequestStatus, getStatusDescription } from '../../../core/models/BookRequestStatus';
import { MyRequest } from 'src/app/core/models/MyRequest';
import { DonorModalComponent } from '../donor-modal/donor-modal.component';

@Component({
  selector: 'app-requesteds',
  templateUrl: './requesteds.component.html',
  styleUrls: ['./requesteds.component.css'],
})
export class RequestedsComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['title', 'author', 'status', 'doador'];
  public requestedBooks = new MatTableDataSource<MyRequestItem>();
  private _messageToModalBody: string;
  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private _bookService: BookService, public dialog: MatDialog) { }

  ngOnInit() {
    this.buscarDados();
  }

  private buscarDados() {
    this.isLoadingSubject.next(true);
    this._bookService.getRequestedBooks(1, 9999)
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false)))
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

  onCustomActionColum(param: MyRequestItem) {
    this._messageToModalBody = '';

    if (param.statusCode === BookRequestStatus.AWAITING_ACTION) {
      this._messageToModalBody = 'Por favor aguarde a decisão do doador.';
    }

    if (param.statusCode === BookRequestStatus.REFUSED) {
      this._messageToModalBody = 'Você não é o ganhador desse livro. =/';
    }

    const modalRef = this.dialog.open(DonorModalComponent,
      {
        minWidth: 450,
        data: {
          bookId: param.bookId,
          bookTitle: param.title,
          messageBody: this._messageToModalBody
        }
      });

    // modalRef.componentInstance.bookId = param.bookId;
    // modalRef.componentInstance.bookTitle = param.title;
    // modalRef.componentInstance.messageBody = this._messageToModalBody;
  }

  public doFilter = (value: string) => {
    this.requestedBooks.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
