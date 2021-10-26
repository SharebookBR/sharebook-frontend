import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { BookService } from 'src/app/core/services/book/book.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DonateComponent } from '../donate/donate.component';
import { Book } from 'src/app/core/models/book';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';
import { Requesters } from 'src/app/core/models/requesters';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.css']
})
export class DonatePageComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'requesterNickName',
    'location',
    'totalBooksWon',
    'totalBooksDonated',
    'requestText',
    'action'];

  donateUsers = new MatTableDataSource<Requesters>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  @ViewChild(MatSort) sort: MatSort;
  returnUrl: string;
  formGroup: FormGroup;
  bookSlug: string;
  book: Book = new Book();
  chooseDateFormated: string;
  warningMessage: string;
  showWarning = false;
  showWarningWinnerChoosed = false;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _scBook: BookService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.formGroup = _formBuilder.group({
      myNote: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(param => (this.bookSlug = param.id));

    this.returnUrl = this._activatedRoute.snapshot.queryParams['returnUrl'] || '/panel';
    this.loadBook();
  }

  ngAfterViewInit(): void {
    this.donateUsers.sort = this.sort;
  }

  onCustom(iconClicked: string, param: Requesters) {
    if (iconClicked === 'donate') {

      switch (this.book.status) {
        case BookDonationStatus.WAITING_APPROVAL:
          alert(`Aguarde a aprovação dessa doação.`);
          return;
        case BookDonationStatus.AVAILABLE:
          alert(`Aguarde a data de decisão.`);
          return;

        // BookDonationStatus.WAITING_DECISION >> não precisa de aviso.
        // é a hora de escolher o ganhador!

        case BookDonationStatus.WAITING_SEND:
        case BookDonationStatus.SENT:
        case BookDonationStatus.RECEIVED:
          alert(`Você já escolheu o ganhador. =)`);
          return;

        case BookDonationStatus.CANCELED:
          alert(`Essa doação foi cancelada. =(`);
          return;
      }

      const modalRef = this.dialog.open(DonateComponent, { minWidth: 450 });

      modalRef.componentInstance.bookId = this.book.id;
      modalRef.componentInstance.userId = param.userId;
      modalRef.componentInstance.userNickName = (param.requesterNickName === null) ? '' : param.requesterNickName;

      modalRef.afterClosed().subscribe(result => {
        if (result) {
          this.back();
        }
      });
    }
  }

  back() {
    this._router.navigate([this.returnUrl]);
  }


  loadBook() {
    this._scBook
      .getBySlug(this.bookSlug)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (book) => {
          this.book = book;
          this.loadRequestersList();
          this.chooseDateFormated = new DatePipe('en-US').transform(book.chooseDate, 'dd/MM/yyyy');

          switch (book.status) {
            case BookDonationStatus.WAITING_APPROVAL:
              this.showWarning = true;
              this.warningMessage = `Aguarde a aprovação dessa doação.`;
              break;
            case BookDonationStatus.AVAILABLE:
              this.showWarning = true;
              this.warningMessage = `Aguarde a data de decisão para escolher o ganhador, em ${this.chooseDateFormated}.`;
              break;

            // BookDonationStatus.WAITING_DECISION >> não precisa de aviso.
            // é a hora de escolher o ganhador!

            case BookDonationStatus.WAITING_SEND:
            case BookDonationStatus.SENT:
            case BookDonationStatus.RECEIVED:
              this.showWarningWinnerChoosed = true;
              break;

            case BookDonationStatus.CANCELED:
              this.showWarning = true;
              this.warningMessage = `Essa doação foi cancelada. =(`;
              break;
          }
        });
  }

  loadRequestersList() {
    this.isLoadingSubject.next(true);
    this._scBook.getRequestersList(this.book.id)
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false)))
      .subscribe(resp => {
        this.donateUsers.data = resp;
      });
  }

  public doFilter = (value: string) => {
    this.donateUsers.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
