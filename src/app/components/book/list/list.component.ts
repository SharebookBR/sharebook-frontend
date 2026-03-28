import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { BookService } from '../../../core/services/book/book.service';
import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { BookDonationStatus } from './../../../core/models/BookDonationStatus';
import { FacilitatorNotesComponent } from '../facilitator-notes/facilitator-notes.component';
import { TrackingComponent } from '../tracking/tracking.component';
import { MainUsersComponent } from '../main-users/main-users.component';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';
import { BookVMItem } from './../../../core/models/bookVMItem';
import { BookVM } from './../../../core/models/bookVM';

type AdminBooksFilter = 'all' | 'needsAction' | 'shipping' | 'finished' | 'ebooks' | 'physical' | 'available';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  public readonly BookDonationStatus = BookDonationStatus;
  myBookArray = new MatTableDataSource<BookVMItem>();
  allBooks: BookVMItem[] = [];
  statusSearchValues = [];
  selectedFilter: AdminBooksFilter = 'needsAction';
  statusFilter = '';
  searchTerm = '';

  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private _scBook: BookService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  getAllBooks() {
    this.isLoadingSubject.next(true);
    this._scBook
      .getAll()
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false))
      )
      .subscribe((resp: BookVM) => {
        this.allBooks = resp.items || [];
        this.applyFilters();
      });
  }

  ngOnInit() {
    this.getAllBooks();
    // Carrega Status do ENUM BookDonationStatus
    const myBookDonationStatus = new Array();
    Object.keys(BookDonationStatus).forEach((key) => {
      myBookDonationStatus.push({
        value: BookDonationStatus[key],
        title: BookDonationStatus[key],
      });

      this.statusSearchValues.push({
        value: BookDonationStatus[key],
        title: getStatusDescription(BookDonationStatus[key]),
      });
    });
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
    this.getAllBooks();
  }

  public doFilter = (value: string) => {
    this.searchTerm = (value || '').trim().toLocaleLowerCase();
    this.applyFilters();
  };

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  searchByStatus(status: string) {
    this.statusFilter = (status || '').trim().toLocaleLowerCase();
    this.applyFilters();
  }

  search(searchStr: string) {
    const mySelect = document.getElementById('selectSearchByStatus') as HTMLInputElement;
    mySelect.value = '';
    this.statusFilter = '';
    this.doFilter(searchStr);
  }

  public setFilter(filter: AdminBooksFilter): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  public isEbook(book: BookVMItem): boolean {
    return (book.type || '').toLowerCase() === 'eletronic';
  }

  public get needsActionCount(): number {
    return this.allBooks.filter(x =>
      x.status === BookDonationStatus.WAITING_APPROVAL || x.status === BookDonationStatus.WAITING_DECISION
    ).length;
  }

  public get shippingCount(): number {
    return this.allBooks.filter(x =>
      x.status === BookDonationStatus.WAITING_SEND || x.status === BookDonationStatus.SENT
    ).length;
  }

  public get finishedCount(): number {
    return this.allBooks.filter(x =>
      x.status === BookDonationStatus.RECEIVED || x.status === BookDonationStatus.CANCELED
    ).length;
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

  public shouldShowDecisionNotice(book: BookVMItem): boolean {
    return !this.isEbook(book) &&
      (book.status === BookDonationStatus.AVAILABLE || book.status === BookDonationStatus.WAITING_DECISION);
  }

  private applyFilters(): void {
    this.myBookArray.data = this.allBooks.filter(book => {
      const matchesFilter = this.matchesFilter(book);
      const matchesStatus = !this.statusFilter || (book.status || '').toLocaleLowerCase() === this.statusFilter;
      const searchable = `${book.title || ''} ${book.author || ''} ${book.donor || ''} ${book.winner || ''} ${book.facilitator || ''}`.toLocaleLowerCase();
      const matchesSearch = !this.searchTerm || searchable.includes(this.searchTerm);

      return matchesFilter && matchesStatus && matchesSearch;
    });
  }

  private matchesFilter(book: BookVMItem): boolean {
    switch (this.selectedFilter) {
      case 'needsAction':
        return book.status === BookDonationStatus.WAITING_APPROVAL || book.status === BookDonationStatus.WAITING_DECISION;
      case 'shipping':
        return book.status === BookDonationStatus.WAITING_SEND || book.status === BookDonationStatus.SENT;
      case 'finished':
        return book.status === BookDonationStatus.RECEIVED || book.status === BookDonationStatus.CANCELED;
      case 'ebooks':
        return this.isEbook(book);
      case 'physical':
        return !this.isEbook(book);
      case 'available':
        return book.status === BookDonationStatus.AVAILABLE;
      default:
        return true;
    }
  }
}
