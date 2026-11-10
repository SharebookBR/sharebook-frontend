import { MyDonation } from 'src/app/features/book/MyDonation';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { BookService } from 'src/app/features/book/services/book.service';
import { BookDonationStatus } from 'src/app/features/book/BookDonationStatus';
import { TrackingComponent } from '../tracking/tracking.component';
import { ConfirmationDialogComponent } from 'src/app/core/directives/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { getStatusDescription } from 'src/app/features/book/getStatusDescription';
import { WinnerUsersComponent } from '../winner-users/winner-users.component';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { UserDonationsList } from 'src/app/features/book/userDonationsList';
import { UserDonationsSummary } from 'src/app/features/book/userDonationsSummary';
import {
  DonationCardAction,
  DonationCardDetail,
  DonationCardViewModel,
} from 'src/app/shared/donation-card/donation-card.component';
import { buildDonationCardTimeline } from 'src/app/shared/donation-card/donation-card-timeline';

type DonationsFilter = 'all' | 'needsAction' | 'physical' | 'digital' | 'finished';

@Component({
    selector: 'app-donations',
    templateUrl: './donations.component.html',
    styleUrls: ['./donations.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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

  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case BookDonationStatus.WAITING_APPROVAL:
      case BookDonationStatus.WAITING_DECISION:
      case BookDonationStatus.WAITING_SEND:
      case BookDonationStatus.SENT:
        return 'status-badge status-warning';
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return 'status-badge status-success';
      case BookDonationStatus.CANCELED:
        return 'status-badge status-danger';
      default:
        return 'status-badge status-neutral';
    }
  }

  getDonations() {
    this.isLoadingSubject.next(true);
    this._bookService
      .getDonatedBooksPaged(this.currentPage, this.pageSize, this.searchTerm, this.selectedFilter)
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false)),
        catchError(() => {
          this._toastr.error('Não foi possível carregar suas doações agora.');
          return of<UserDonationsList | null>(null);
        })
      )
      .subscribe((resp) => {
        if (!resp) {
          return;
        }
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
              .pipe(
                takeUntil(this._destroySubscribes$),
                catchError((error) => {
                  const msg = error?.error?.messages?.join(' ') || error?.message || 'Erro ao cancelar a doação. Tente novamente.';
                  this._toastr.error(msg);
                  return of(null);
                })
              )
              .subscribe((resp) => {
                if (resp?.['success']) {
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
          this._toastr.info('Você ainda não escolheu quem vai receber.');
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

  public getCard(book: MyDonation): DonationCardViewModel {
    const details: DonationCardDetail[] = [];
    const footerDetails: DonationCardDetail[] = [];

    if (this.isEbook(book)) {
      details.push({ label: 'Downloads', value: book.downloadCount || 0 });
    } else {
      if (this.canShowWinner(book)) {
        details.push({ label: 'Pessoa escolhida', value: book.winner || '-' });
      }

      if (!this.isPreLaunch(book) && !this.canShowRequestLimit(book)) {
        details.push({ label: 'Pessoas interessadas', value: book.totalInterested || 0 });
      }

      if (this.canShowReleaseInterest(book)) {
        footerDetails.push({ label: 'Notificações', icon: 'notifications', value: book.releaseInterestCount || 0 });
      }
    }

    return {
      title: book.title,
      author: book.author,
      isDigital: this.isEbook(book),
      statusLabel: this.getTranslatedStatusDescription(book.status),
      statusClass: this.getStatusBadgeClass(book.status),
      releaseDate: this.isPreLaunch(book) ? book.releaseDate : undefined,
      decisionNotice: this.getDecisionNoticeLabel(book),
      timeline: buildDonationCardTimeline({
        creationDate: book.creationDate,
        approvedAt: book.approvedAt,
        chooseDate: book.chooseDate,
        releaseDate: book.releaseDate,
        isDigital: this.isEbook(book),
        isScheduled: this.isPreLaunch(book),
      }),
      details,
      progress: this.canShowRequestLimit(book)
        ? {
            label: this.getRequestCountLabel(book),
            percentage: this.getRequestProgressPercentage(book),
            value: this.getRequestProgressValue(book),
            max: book.maxRequestsPerBook || 0,
            ariaLabel: this.getRequestProgressAriaLabel(book),
          }
        : undefined,
      footerDetails,
      actions: this.getCardActions(book),
    };
  }

  public onCardAction(actionId: string, book: MyDonation): void {
    if (actionId === 'donate') {
      this.executePrimaryAction(book);
      return;
    }

    this.onCustom(actionId, book);
  }

  private getCardActions(book: MyDonation): DonationCardAction[] {
    const actions: DonationCardAction[] = [];

    if (this.canPrimaryAction(book)) {
      actions.push({
        id: 'donate',
        label: this.getPrimaryActionLabel(book),
        icon: this.canChooseWinnerNow(book) ? 'emoji_events' : 'chat_bubble_outline',
        variant: this.canChooseWinnerNow(book) ? 'success' : 'primary',
      });
    }

    if (this.canRenew(book)) {
      actions.push({
        id: 'renewChooseDate',
        label: 'Adiar decisão',
        icon: 'calendar_month',
        variant: 'ghost',
        appearance: 'stroked',
      });
    }

    if (this.canTrack(book)) {
      actions.push({
        id: 'markAsFinished',
        label: 'Marcar finalizado',
        icon: 'check_circle_outline',
        variant: 'success',
      });
    }

    if (this.canShowWinner(book)) {
      actions.push({
        id: 'ShowWinnerInfo',
        label: 'Ver pessoa escolhida',
        icon: 'person',
        variant: 'ghost',
        appearance: 'stroked',
      });
    }

    if (this.canCancel(book)) {
      actions.push({ id: 'CancelDonation', label: 'Cancelar', icon: 'delete_outline', variant: 'danger' });
    }

    return actions;
  }

  public getPrimaryActionLabel(book: MyDonation): string {
    if (this.isEbook(book)) {
      return '';
    }

    if (this.canChooseWinnerNow(book)) {
      return 'Escolher quem vai receber';
    }

    return 'Ver solicitações';
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
    return !this.isEbook(book) && !this.isPreLaunch(book);
  }

  public canShowRequestLimit(book: MyDonation): boolean {
    return !this.isEbook(book) &&
      book.status !== BookDonationStatus.WAITING_APPROVAL &&
      book.status !== BookDonationStatus.SCHEDULED &&
      Number.isFinite(book.maxRequestsPerBook) &&
      (book.maxRequestsPerBook || 0) > 0;
  }

  public getRequestCountLabel(book: MyDonation): string {
    return `${this.getRequestCount(book)} de ${book.maxRequestsPerBook} solicitações`;
  }

  public getRequestProgressPercentage(book: MyDonation): number {
    const limit = book.maxRequestsPerBook || 0;
    if (!limit) {
      return 0;
    }

    return Math.min(Math.max(Math.round((this.getRequestCount(book) / limit) * 100), 0), 100);
  }

  public getRequestProgressValue(book: MyDonation): number {
    return Math.min(this.getRequestCount(book), book.maxRequestsPerBook || 0);
  }

  public getRequestProgressAriaLabel(book: MyDonation): string {
    return this.getRequestCountLabel(book);
  }

  public isEbook(book: MyDonation): boolean {
    return (book.type || '').toLowerCase() === 'eletronic';
  }

  private getRequestCount(book: MyDonation): number {
    return Math.max(book.totalInterested || 0, 0);
  }

  public canShowReleaseInterest(book: MyDonation): boolean {
    return !this.isEbook(book) && book.status !== BookDonationStatus.WAITING_APPROVAL;
  }

  public isPreLaunch(book: MyDonation): boolean {
    return book.status === BookDonationStatus.SCHEDULED;
  }

  public getDecisionNoticeLabel(book: MyDonation): string {
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
