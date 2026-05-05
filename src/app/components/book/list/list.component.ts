import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { AppConfig, APP_CONFIG } from '../../../app-config.module';
import { BookService } from '../../../core/services/book/book.service';
import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { BookDonationStatus } from './../../../core/models/BookDonationStatus';
import { FacilitatorNotesComponent } from '../facilitator-notes/facilitator-notes.component';
import { TrackingComponent } from '../tracking/tracking.component';
import { MainUsersComponent } from '../main-users/main-users.component';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';
import { BookVMItem } from './../../../core/models/bookVMItem';
import { AdminBookList } from './../../../core/models/adminBookList';
import { AdminBookSummary } from './../../../core/models/adminBookSummary';

type AdminBooksFilter = 'all' | 'needsAction' | 'shipping' | 'finished' | 'ebooks' | 'physical' | 'available';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  public readonly BookDonationStatus = BookDonationStatus;
  pagedBooks: BookVMItem[] = [];
  statusSearchValues = [];
  selectedFilter: AdminBooksFilter = 'needsAction';
  statusFilter = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 24;
  totalItems = 0;
  summary: AdminBookSummary = this.createEmptySummary();
  readonly pageSizeOptions = [12, 24, 48, 96];

  private _destroySubscribes$ = new Subject<void>();
  private _searchInput$ = new Subject<string>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private _scBook: BookService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_CONFIG) public config: AppConfig
  ) {}

  loadBooks() {
    this.isLoadingSubject.next(true);
    this._scBook
      .getAdminBooks(this.currentPage, this.pageSize, this.searchTerm, this.statusFilter, this.selectedFilter)
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false))
      )
      .subscribe((resp: AdminBookList) => {
        this.pagedBooks = resp.items || [];
        this.summary = resp.summary || this.createEmptySummary();
        this.totalItems = resp.totalItems || 0;
        this.currentPage = resp.page || 1;
        this.pageSize = resp.itemsPerPage || this.pageSize;
      });
  }

  ngOnInit() {
    this._searchInput$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this._destroySubscribes$)
      )
      .subscribe((value) => {
        this.searchTerm = value;
        this.currentPage = 1;
        this.loadBooks();
      });

    Object.keys(BookDonationStatus).forEach((key) => {
      this.statusSearchValues.push({
        value: BookDonationStatus[key],
        title: getStatusDescription(BookDonationStatus[key]),
      });
    });

    this.loadBooks();
  }

  onCustom(iconClicked: string, param: BookVMItem) {
    switch (iconClicked) {
      case 'cancelDonation': {
        // chamada do modal de confirmação antes de efetuar a ação do btnCancelDonation
        if (param.status === BookDonationStatus.RECEIVED || param.status === BookDonationStatus.CANCELED) {
          alert(`Não é possível cancelar essa doação com status = ${param.status}`);
          return;
        }

        const modalRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Atenção!',
            message: 'Confirma o cancelamento da doação?',
            btnOkText: 'Confirmar',
            btnCancelText: 'Cancelar',
          },
        });

        modalRef.afterClosed().subscribe((result) => {
          if (result) {
            this._scBook
              .cancelDonation(param.id)
              .pipe(takeUntil(this._destroySubscribes$))
              .subscribe((resp) => {
                if (resp['success']) {
                  this._toastr.success('Doação cancelada com sucesso.');
                  this.reloadData();
                }
              });
          }
        });

        break;
      }
      case 'donate': {
        this._router.navigate([`book/donate/${param.slug}`], {
          queryParams: {
            returnUrl: this._activatedRoute.snapshot.url.join('/'),
          },
        });

        break;
      }
      case 'edit': {
        this._router.navigate([`book/form/${param.id}`]);
        break;
      }
      case 'facilitatorNotes': {
        const modalRef = this.dialog.open(FacilitatorNotesComponent, { minWidth: 450 });

        modalRef.afterClosed().subscribe((result) => {
          if (result) this.reloadData();
        });

        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        modalRef.componentInstance.facilitatorNotes = param.facilitatorNotes === null ? '' : param.facilitatorNotes;
        break;
      }
      case 'openPdf': {
        if (isPlatformBrowser(this.platformId)) {
          window.open(this.getPdfUrl(param), '_blank');
        }
        break;
      }
      case 'trackNumber': {
        if (param.status !== BookDonationStatus.WAITING_SEND && param.status !== BookDonationStatus.SENT) {
          alert(
            `Não é possível informar o código de rastreio agora.\nStatus necessário: ${BookDonationStatus.WAITING_SEND} ou ${BookDonationStatus.SENT}.\nStatus atual: ${param.status}`
          );
          return;
        }

        const modalRef = this.dialog.open(TrackingComponent, { minWidth: 550 });

        modalRef.afterClosed().subscribe((result) => {
          if (result) this.reloadData();
        });

        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        modalRef.componentInstance.trackingNumber = param.trackingNumber;

        break;
      }
      case 'showUsersInfo': {
        const modalRef = this.dialog.open(MainUsersComponent);
        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        break;
      }
      case 'renewChooseDate': {
        if (param.status !== BookDonationStatus.WAITING_DECISION) {
          alert(
            `Não é possível renovar esta doação agora.\nStatus necessário: ${BookDonationStatus.WAITING_DECISION}.\nStatus atual: ${param.status}`
          );
          return;
        }

        const chooseDate = Math.floor(new Date(param.chooseDate).getTime() / (3600 * 24 * 1000));
        const todayDate = Math.floor(new Date().getTime() / (3600 * 24 * 1000));

        if (!chooseDate || chooseDate - todayDate > 0) {
          alert('Aguarde a data de escolha!');
        } else {
          const modalRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Atenção!',
              message: 'Confirma a renovação da data de doação?',
              btnOkText: 'Confirmar',
              btnCancelText: 'Cancelar',
            },
          });

          modalRef.afterClosed().subscribe((result) => {
            if (result) {
              this._scBook
                .renewChooseDate(param.id)
                .pipe(takeUntil(this._destroySubscribes$))
                .subscribe(
                  () => {
                    this._toastr.success('Doação renovada com sucesso.');
                    this.reloadData();
                  },
                  (error) => {
                    console.error('Erro ao renovar data de escolha:', error);
                    const errorMessage = error?.error?.messages?.join(' ') || error?.message || 'Erro inesperado.';
                    this._toastr.error(errorMessage);
                  }
                );
            }
          });
        }

        break;
      }
    }
  }

  public getTranslatedStatusDescription(status: string): string {
    return getStatusDescription(status);
  }

  public getTextColor(status) {
    switch (status) {
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return '#28a745';
      case BookDonationStatus.CANCELED:
      case BookDonationStatus.WAITING_DECISION:
        return 'red';
      default:
        return '#444444';
    }
  }

  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return 'status-badge status-success';
      case BookDonationStatus.CANCELED:
        return 'status-badge status-danger';
      case BookDonationStatus.WAITING_DECISION:
        return 'status-badge status-warning';
      case BookDonationStatus.WAITING_SEND:
      case BookDonationStatus.SENT:
        return 'status-badge status-info';
      case BookDonationStatus.WAITING_APPROVAL:
        return 'status-badge status-neutral';
      default:
        return 'status-badge status-neutral';
    }
  }

  reloadData() {
    this.loadBooks();
  }

  public doFilter = (value: string) => {
    this.searchTerm = (value || '').trim();
    this._searchInput$.next(this.searchTerm);
  };

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  searchByStatus(status: string) {
    this.statusFilter = (status || '').trim();
    this.currentPage = 1;
    this.loadBooks();
  }

  search(searchStr: string) {
    this.doFilter(searchStr);
  }

  public setFilter(filter: AdminBooksFilter): void {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.loadBooks();
  }

  public isEbook(book: BookVMItem): boolean {
    return (book.type || '').toLowerCase() === 'eletronic';
  }

  public get needsActionCount(): number {
    return this.summary.needsAction || 0;
  }

  public get shippingCount(): number {
    return this.summary.shipping || 0;
  }

  public get finishedCount(): number {
    return this.summary.finished || 0;
  }

  public get totalFilteredBooks(): number {
    return this.totalItems;
  }

  public get totalPages(): number {
    return Math.max(Math.ceil(this.totalFilteredBooks / this.pageSize), 1);
  }

  public get paginationStart(): number {
    if (this.totalFilteredBooks === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  public get paginationEnd(): number {
    if (this.totalFilteredBooks === 0) {
      return 0;
    }

    return Math.min(this.currentPage * this.pageSize, this.totalFilteredBooks);
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
    this.loadBooks();
  }

  public goToPage(page: number): void {
    const nextPage = Math.min(Math.max(page, 1), this.totalPages);

    if (nextPage === this.currentPage) {
      return;
    }

    this.currentPage = nextPage;
    this.loadBooks();
  }

  public getPrimaryMetric(book: BookVMItem): string {
    if (this.isEbook(book)) {
      return `${book.downloadCount || 0} download(s)`;
    }

    if (!this.canShowInterestedCount(book)) {
      return 'Sem etapa pública de pedidos ainda';
    }

    const interestedCount = book.totalInterested || 0;
    const interestedLabel = interestedCount === 1 ? 'interessado' : 'interessados';
    return `${interestedCount} ${interestedLabel}`;
  }

  public getPrimaryActionLabel(book: BookVMItem): string {
    if (this.canChooseWinnerNow(book)) {
      return 'Escolher ganhador';
    }

    return 'Ver pedidos';
  }

  public getPrimaryActionIcon(book: BookVMItem): string {
    return this.canChooseWinnerNow(book) ? 'emoji_events' : 'format_list_bulleted';
  }

  public getDecisionNoticeLabel(book: BookVMItem): string {
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

  public canChooseWinnerNow(book: BookVMItem): boolean {
    if (book.status !== BookDonationStatus.WAITING_DECISION || !book.chooseDate) {
      return false;
    }

    const chooseDate = new Date(book.chooseDate);
    if (Number.isNaN(chooseDate.getTime())) {
      return false;
    }

    return Date.now() >= chooseDate.getTime();
  }

  public canShowPrimaryAction(book: BookVMItem): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.AVAILABLE || book.status === BookDonationStatus.WAITING_DECISION);
  }

  public canShowDecisionDate(book: BookVMItem): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.AVAILABLE || book.status === BookDonationStatus.WAITING_DECISION);
  }

  public canShowInterestedCount(book: BookVMItem): boolean {
    return !this.isEbook(book) && book.status !== BookDonationStatus.WAITING_APPROVAL;
  }

  public canShowWinner(book: BookVMItem): boolean {
    return !this.isEbook(book) && !!book.winner;
  }

  public canShowTrackingInfo(book: BookVMItem): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.WAITING_SEND ||
        book.status === BookDonationStatus.SENT ||
        book.status === BookDonationStatus.RECEIVED) &&
      !!book.trackingNumber;
  }

  public canShowFacilitator(book: BookVMItem): boolean {
    return !this.isEbook(book) && !!book.facilitator;
  }

  public canShowTrackAction(book: BookVMItem): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.WAITING_SEND || book.status === BookDonationStatus.SENT);
  }

  public canOpenPdf(book: BookVMItem): boolean {
    return this.isEbook(book) && !!book.slug;
  }

  public getPdfUrl(book: BookVMItem): string {
    return `${this.config.apiEndpoint}/book/DownloadEBook/${book.slug}`;
  }

  public shouldShowDecisionNotice(book: BookVMItem): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.AVAILABLE || book.status === BookDonationStatus.WAITING_DECISION);
  }

  private createEmptySummary(): AdminBookSummary {
    return {
      all: 0,
      needsAction: 0,
      shipping: 0,
      physical: 0,
      ebooks: 0,
      finished: 0,
      available: 0,
    };
  }
}
