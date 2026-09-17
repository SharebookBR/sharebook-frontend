import { MyDonation } from '../../../core/models/MyDonation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { BookService } from '../../../core/services/book/book.service';
import { BookDonationStatus } from '../../../core/models/BookDonationStatus';
import { TrackingComponent } from '../tracking/tracking.component';
import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';
import { WinnerUsersComponent } from '../winner-users/winner-users.component';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { UserDonationsList } from 'src/app/core/models/userDonationsList';
import { UserDonationsSummary } from 'src/app/core/models/userDonationsSummary';

type DonationsFilter = 'all' | 'needsAction' | 'physical' | 'digital' | 'finished';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
})
export class DonationsComponent implements OnInit, OnDestroy {
  public readonly BookDonationStatus = BookDonationStatus;
  donatedBooks: MyDonation[] = [];
  selectedFilter: DonationsFilter = 'needsAction';
  searchTerm = '';
  currentPage = 1;
  pageSize = 24;
  totalItems = 0;
  summary: UserDonationsSummary = this.createEmptySummary();
  readonly pageSizeOptions = [12, 24, 48, 96];

  private _destroySubscribes$ = new Subject<void>();
  private _searchInput$ = new Subject<string>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private _bookService: BookService,
    private _toastr: ToastrService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _seo: SeoService
  ) { }

  ngOnInit() {
    this._seo.generateTags({ title: 'Minhas Doações' });
    this._searchInput$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this._destroySubscribes$)
      )
      .subscribe((value) => {
        this.searchTerm = value;
        this.currentPage = 1;
        this.getDonations();
      });

    this.getDonations();
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
      .getDonatedBooksPaged(this.currentPage, this.pageSize, this.searchTerm, this.selectedFilter)
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((resp: UserDonationsList) => {
        this.donatedBooks = resp.items || [];
        this.summary = resp.summary || this.createEmptySummary();
        this.totalItems = resp.totalItems || 0;
        this.currentPage = resp.page || 1;
        this.pageSize = resp.itemsPerPage || this.pageSize;
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
          this._toastr.warning(
            `Não é possível adiar a decisão neste status (${this.getTranslatedStatusDescription(param.status)}).`
          );
          return;
        }

        const chooseDate = Math.floor(
          new Date(param.chooseDate).getTime() / (3600 * 24 * 1000)
        );
        const todayDate = Math.floor(new Date().getTime() / (3600 * 24 * 1000));

        if (!chooseDate || chooseDate - todayDate > 0) {
          this._toastr.info('Aguarde a data de escolha para adiar a decisão.');
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
      case 'markAsFinished': {
        const modalRef = this.dialog.open(TrackingComponent, {
          width: '95vw',
          maxWidth: '520px',
          maxHeight: '90vh',
          autoFocus: false
        });

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
          this._toastr.warning(
            `Não é possível cancelar uma doação com status ${this.getTranslatedStatusDescription(param.status)}.`
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
          this._toastr.info('Você ainda não escolheu o ganhador.');
          return;
        }
        const modalRef = this.dialog.open(WinnerUsersComponent, {
          width: '760px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          autoFocus: false
        });

        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        modalRef.componentInstance.bookSlug = param.slug;
        break;
      }

    }
  }

  public doFilter = (value: string) => {
    this.searchTerm = (value || '').trim();
    this._searchInput$.next(this.searchTerm);
  }

  public setFilter(filter: DonationsFilter): void {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.getDonations();
  }

  public get waitingDecisionCount(): number {
    return this.summary.waitingDecision || 0;
  }

  public get waitingSendCount(): number {
    return this.summary.waitingSend || 0;
  }

  public get finishedCount(): number {
    return this.summary.finished || 0;
  }

  public get ebookDownloadsTotal(): number {
    return this.summary.ebookDownloadsTotal || 0;
  }

  public get totalPages(): number {
    return Math.max(Math.ceil(this.totalItems / this.pageSize), 1);
  }

  public get paginationStart(): number {
    if (this.totalItems === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  public get paginationEnd(): number {
    if (this.totalItems === 0) {
      return 0;
    }

    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  public get visiblePages(): number[] {
    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

    const startPage = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - 4));
    return Array.from({ length: 5 }, (_, index) => startPage + index);
  }

  public changePageSize(value: string): void {
    const nextPageSize = Number(value);

    if (!nextPageSize || nextPageSize === this.pageSize) {
      return;
    }

    this.pageSize = nextPageSize;
    this.currentPage = 1;
    this.getDonations();
  }

  public goToPage(page: number): void {
    const nextPage = Math.min(Math.max(page, 1), this.totalPages);

    if (nextPage === this.currentPage) {
      return;
    }

    this.currentPage = nextPage;
    this.getDonations();
  }

  public getMobilePrimaryMetric(book: MyDonation): string {
    if (this.isEbook(book)) {
      return `Total de downloads: ${book.downloadCount || 0}`;
    }

    const interestedCount = book.totalInterested || 0;
    const interestedLabel = interestedCount === 1 ? 'interessado' : 'interessados';
    const summary = `${interestedCount} ${interestedLabel}`;
    const decisionNotice = this.getDecisionNoticeLabel(book);

    if (decisionNotice) {
      return `${summary} • ${decisionNotice}`;
    }

    return summary;
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

    if (this.canChooseWinnerNow(book)) {
      return 'Escolher ganhador';
    }

    return 'Ver pedidos';
  }

  public canChooseWinnerNow(book: MyDonation): boolean {
    if (book.status !== BookDonationStatus.WAITING_DECISION || !book.chooseDate) {
      return false;
    }

    const chooseDate = new Date(book.chooseDate);
    if (Number.isNaN(chooseDate.getTime())) {
      return false;
    }

    return Date.now() >= chooseDate.getTime();
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

  public canPrimaryAction(book: MyDonation): boolean {
    return !this.isEbook(book);
  }

  public isEbook(book: MyDonation): boolean {
    return (book.type || '').toLowerCase() === 'eletronic';
  }

  private getDecisionNoticeLabel(book: MyDonation): string {
    if (!this.shouldShowDecisionNotice(book) || !book.chooseDate) {
      return '';
    }

    const chooseDate = new Date(book.chooseDate);
    if (Number.isNaN(chooseDate.getTime())) {
      return '';
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dueDate = new Date(chooseDate.getFullYear(), chooseDate.getMonth(), chooseDate.getDate()).getTime();
    const dayDiff = Math.round((dueDate - today) / (24 * 60 * 60 * 1000));

    if (dayDiff > 0) {
      return `Decisão em ${dayDiff} ${dayDiff === 1 ? 'dia' : 'dias'}`;
    }

    if (dayDiff === 0) {
      return 'Decisão hoje';
    }

    const lateDays = Math.abs(dayDiff);
    return `Decisão atrasada há ${lateDays} ${lateDays === 1 ? 'dia' : 'dias'}`;
  }

  private shouldShowDecisionNotice(book: MyDonation): boolean {
    return book.status === BookDonationStatus.AVAILABLE || book.status === BookDonationStatus.WAITING_DECISION;
  }

  private createEmptySummary(): UserDonationsSummary {
    return {
      waitingDecision: 0,
      waitingSend: 0,
      finished: 0,
      ebookDownloadsTotal: 0,
    };
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
