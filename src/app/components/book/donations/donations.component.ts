import { MyDonation } from '../../../core/models/MyDonation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

import { BookService } from '../../../core/services/book/book.service';
import { BookDonationStatus } from '../../../core/models/BookDonationStatus';
import { TrackingComponent } from '../tracking/tracking.component';
import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';
import { WinnerUsersComponent } from '../winner-users/winner-users.component';

type DonationsFilter = 'all' | 'needsAction' | 'physical' | 'digital' | 'finished';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
})
export class DonationsComponent implements OnInit, OnDestroy {
  public readonly BookDonationStatus = BookDonationStatus;
  donatedBooks: MyDonation[] = [];
  allDonatedBooks: MyDonation[] = [];
  selectedFilter: DonationsFilter = 'needsAction';
  searchTerm = '';

  tableSettings: any;

  statusBtnWinner: boolean;

  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private _bookService: BookService,
    private _toastr: ToastrService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this._breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe();
    this.getDonations();
    // Carrega Status do ENUM BookDonationStatus
    const myBookDonationStatus = new Array();
    Object.keys(BookDonationStatus).forEach((key) => {
      myBookDonationStatus.push({
        value: BookDonationStatus[key],
        title: BookDonationStatus[key],
      });
    });
  }

  public getTranslatedStatusDescription(status: string): string {
    return getStatusDescription(status);
  }

  public getStatusBadgeBackgroundColor(status) {
    switch (status) {
      case BookDonationStatus.WAITING_APPROVAL:
      case BookDonationStatus.WAITING_DECISION:
      case BookDonationStatus.WAITING_SEND:
      case BookDonationStatus.SENT:
        return '#ffc107'; // warning
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return '#28a745'; // success
      case BookDonationStatus.CANCELED:
        return '#dc3545'; // danger
      default:
        return '#6c757d'; // secondary
    }
  }

  public getStatusBadgeTextColor(status) {
    switch (status) {
      case BookDonationStatus.WAITING_APPROVAL:
      case BookDonationStatus.WAITING_DECISION:
      case BookDonationStatus.WAITING_SEND:
      case BookDonationStatus.SENT:
        return '#212529';
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return '#fff';
      case BookDonationStatus.CANCELED:
        return '#fff';
      default:
        return '#fff';
    }
  }

  getDonations() {
    this.isLoadingSubject.next(true);
    this._bookService
      .getDonatedBooks()
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((resp: MyDonation[]) => {
        this.allDonatedBooks = this.sortByPriority(resp || []);
        this.applyFilters();
      });
  }

  onCustom(iconClicked: string, param: MyDonation) {
    switch (iconClicked) {
      case 'donate': {
        this._router.navigate([`book/donate/${param.slug}`], {
          queryParams: {
            returnUrl: this._activatedRoute.snapshot.url.join('/'),
          },
        });
        break;

      }
      case 'renewChooseDate': {
        if (param.status !== BookDonationStatus.WAITING_DECISION) {
          alert(
            `Não é possível adiar decisão. \nstatus requerido = ${BookDonationStatus.WAITING_DECISION}\n` +
            `status atual = ${param.status}`
          );
          return;
        }

        const chooseDate = Math.floor(
          new Date(param.chooseDate).getTime() / (3600 * 24 * 1000)
        );
        const todayDate = Math.floor(new Date().getTime() / (3600 * 24 * 1000));

        if (!chooseDate || chooseDate - todayDate > 0) {
          alert('Aguarde a data de escolha!');
        } else {

          const modalRef = this.dialog.open(ConfirmationDialogComponent,
            {
              data: {
                title: 'Atenção!',
                message: 'Confirma adiar a data de escolha?',
                btnOkText: 'Confirmar',
                btnCancelText: 'Cancelar'
              }
            });

          modalRef.afterClosed().subscribe(result => {
            if (result) {
              this._bookService
                .renewChooseDate(param.id)
                .pipe(takeUntil(this._destroySubscribes$))
                .subscribe(
                  () => {
                    this._toastr.success('Data de escolha adiada com sucesso.');
                    this.getDonations();
                  },
                  (error) => {
                    this._toastr.error(error);
                  }
                );
            }
          });
        }

        break;
      }
      case 'trackNumber': {
        if (
          param.status !== BookDonationStatus.WAITING_SEND &&
          param.status !== BookDonationStatus.SENT
        ) {
          alert(
            `Não é possível informar código de rastreio. \nstatus requerido = ${BookDonationStatus.WAITING_SEND} ` +
            `ou ${BookDonationStatus.SENT}\nstatus atual = ${param.status}`
          );
          return;
        }

        const modalRef = this.dialog.open(TrackingComponent, { minWidth: 450 });

        modalRef.afterClosed().subscribe(result => {
          if (result) {
            this.getDonations();
          }
        });

        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        modalRef.componentInstance.trackingNumber = param.trackingNumber;
        break;
      }
      case 'CancelDonation': {
        // chamada do modal de confirmação antes de efetuar a ação do btnCancelDonation
        if (
          param.status === BookDonationStatus.RECEIVED ||
          param.status === BookDonationStatus.CANCELED
        ) {
          alert(
            `Não é possível cancelar essa doação com status = ${param.status}`
          );
          return;
        }

        const modalRef = this.dialog.open(ConfirmationDialogComponent,
          {
            data: {
              title: 'Atenção!',
              message: 'Confirma o cancelamento da doação?',
              btnOkText: 'Confirmar',
              btnCancelText: 'Cancelar'
            }
          });

        modalRef.afterClosed().subscribe(result => {
          if (result) {
            this._bookService
              .cancelDonation(param.id)
              .pipe(takeUntil(this._destroySubscribes$))
              .subscribe((resp) => {
                if (resp['success']) {
                  this._toastr.success('Doação cancelada com sucesso.');
                  this.getDonations();
                }
              });
          }
        });

        break;
      }
      case 'ShowWinnerInfo': {

        if (param.status !== BookDonationStatus.WAITING_SEND &&
          param.status !== BookDonationStatus.SENT &&
          param.status !== BookDonationStatus.RECEIVED) {
          alert(
            `Você ainda não escolheu o ganhador.`
          );
          return;
        }
        const modalRef = this.dialog.open(WinnerUsersComponent, { minWidth: 500 });

        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        modalRef.componentInstance.bookSlug = param.slug;
        break;
      }

    }
  }

  public doFilter = (value: string) => {
    this.searchTerm = (value || '').trim().toLocaleLowerCase();
    this.applyFilters();
  }

  public setFilter(filter: DonationsFilter): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  public get waitingDecisionCount(): number {
    return this.allDonatedBooks.filter(x => x.status === BookDonationStatus.WAITING_DECISION).length;
  }

  public get waitingSendCount(): number {
    return this.allDonatedBooks.filter(x => x.status === BookDonationStatus.WAITING_SEND).length;
  }

  public get finishedCount(): number {
    return this.allDonatedBooks.filter(x =>
      x.status === BookDonationStatus.RECEIVED || x.status === BookDonationStatus.CANCELED
    ).length;
  }

  public get ebookDownloadsTotal(): number {
    return this.allDonatedBooks
      .filter(x => this.isEbook(x))
      .reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  }

  public getMobilePrimaryMetric(book: MyDonation): string {
    if (this.isEbook(book)) {
      return `Total de downloads: ${book.downloadCount || 0}`;
    }

    if (book.status === BookDonationStatus.WAITING_DECISION) {
      return `Escolha até ${this.formatDate(book.chooseDate)}`;
    }

    return `${book.totalInterested || 0} interessado(s)`;
  }

  public getDesktopInterestedValue(book: MyDonation): string {
    if (this.isEbook(book)) {
      return `${book.downloadCount || 0} download(s)`;
    }

    return `${book.totalInterested || 0}`;
  }

  public getDesktopShowcaseValue(book: MyDonation): string {
    if (this.isEbook(book)) {
      return '-';
    }

    return `${book.daysInShowcase || 0}`;
  }

  public getPrimaryActionLabel(book: MyDonation): string {
    if (this.isEbook(book)) {
      return '';
    }

    return 'Ver interessados';
  }

  public executePrimaryAction(book: MyDonation): void {
    if (this.isEbook(book)) {
      return;
    }

    this.onCustom('donate', book);
  }

  public canRenew(book: MyDonation): boolean {
    return !this.isEbook(book) && book.status === BookDonationStatus.WAITING_DECISION;
  }

  public canTrack(book: MyDonation): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.WAITING_SEND || book.status === BookDonationStatus.SENT);
  }

  public canShowWinner(book: MyDonation): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.WAITING_SEND ||
        book.status === BookDonationStatus.SENT ||
        book.status === BookDonationStatus.RECEIVED);
  }

  public canCancel(book: MyDonation): boolean {
    return book.status !== BookDonationStatus.RECEIVED && book.status !== BookDonationStatus.CANCELED;
  }

  private isEbook(book: MyDonation): boolean {
    return (book.type || '').toLowerCase() === 'eletronic';
  }

  private applyFilters(): void {
    const filtered = this.allDonatedBooks.filter(book => {
      if (!this.matchFilter(book)) {
        return false;
      }

      if (!this.searchTerm) {
        return true;
      }

      const searchBag = [
        book.title,
        book.author,
        this.getTranslatedStatusDescription(book.status),
        this.isEbook(book) ? 'digital' : 'fisico'
      ].join(' ').toLowerCase();

      return searchBag.includes(this.searchTerm);
    });

    this.donatedBooks = filtered;
  }

  private matchFilter(book: MyDonation): boolean {
    switch (this.selectedFilter) {
      case 'needsAction':
        return book.status === BookDonationStatus.WAITING_DECISION || book.status === BookDonationStatus.WAITING_SEND;
      case 'physical':
        return !this.isEbook(book);
      case 'digital':
        return this.isEbook(book);
      case 'finished':
        return book.status === BookDonationStatus.RECEIVED || book.status === BookDonationStatus.CANCELED;
      case 'all':
      default:
        return true;
    }
  }

  private sortByPriority(books: MyDonation[]): MyDonation[] {
    return [...books].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime() || 0;
      const dateB = new Date(b.creationDate).getTime() || 0;
      return dateB - dateA;
    });
  }

  private formatDate(value: Date): string {
    if (!value) {
      return '--/--/----';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '--/--/----';
    }

    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}

