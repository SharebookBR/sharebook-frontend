import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { MyRequestItem } from './../../../core/models/MyRequestItem';
import { BookService } from '../../../core/services/book/book.service';
import { BookRequestStatus, getStatusDescription } from '../../../core/models/BookRequestStatus';
import { MyRequest } from 'src/app/core/models/MyRequest';
import { DonorModalComponent } from '../donor-modal/donor-modal.component';
import { SeoService } from 'src/app/core/services/seo/seo.service';

type RequestsFilter = 'all' | 'awaiting' | 'won' | 'finished';

@Component({
  selector: 'app-requesteds',
  templateUrl: './requesteds.component.html',
  styleUrls: ['./requesteds.component.css'],
})
export class RequestedsComponent implements OnInit, OnDestroy {
  public requestedBooks = new MatTableDataSource<MyRequestItem>();
  public allRequestedBooks: MyRequestItem[] = [];
  public selectedFilter: RequestsFilter = 'awaiting';
  public searchTerm = '';
  private _messageToModalBody: string;
  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private _bookService: BookService,
    private _toastr: ToastrService,
    public dialog: MatDialog,
    private _seo: SeoService
  ) {}

  ngOnInit() {
    this._seo.generateTags({ title: 'Meus Pedidos' });
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
        this.allRequestedBooks = resp.items || [];
        this.applyFilters();
      });
  }

  public getTranslatedStatusDescription(status: string): string {
    return getStatusDescription(status);
  }

  public isDonated(status: string): boolean {
    return status === BookRequestStatus.DONATED;
  }

  public getTrackingNumber(item: MyRequestItem): string | null {
    if (!this.isDonated(item.status)) {
      return null;
    }

    const trackingNumber = item.trackingNumber?.trim();
    return trackingNumber ? trackingNumber : null;
  }

  public getLogisticsLabel(item: MyRequestItem): string {
    if (!this.isDonated(item.status)) {
      return 'Aguardando decisão do doador';
    }

    switch ((item.bookStatus || '').toLowerCase()) {
      case 'waitingsend':
        return 'Aguardando envio';
      case 'sent':
        return 'Enviado';
      case 'received':
        return 'Recebido';
      default:
        return 'Em andamento';
    }
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
        title: 'Cancelar solicitação',
        message: `Tem certeza que quer cancelar a solicitação do livro "${param.title}"?`,
        btnOkText: 'Sim, cancelar',
        btnCancelText: 'Não, manter solicitação',
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
    this.searchTerm = (value || '').trim().toLocaleLowerCase();
    this.applyFilters();
  };

  public setFilter(filter: RequestsFilter): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  public canCancelRequest(param: MyRequestItem): boolean {
    return param.status === BookRequestStatus.AWAITING_ACTION;
  }

  public canTalkToDonor(param: MyRequestItem): boolean {
    return param.status === BookRequestStatus.DONATED;
  }

  public canMarkAsReceived(param: MyRequestItem): boolean {
    return this.isDonated(param.status) && (param.bookStatus || '').toLowerCase() !== 'received';
  }

  public copyTrackingCode(param: MyRequestItem): void {
    const trackingNumber = this.getTrackingNumber(param);

    if (!trackingNumber || !navigator?.clipboard?.writeText) {
      this._toastr.info('Código de rastreio indisponível para cópia.');
      return;
    }

    navigator.clipboard.writeText(trackingNumber)
      .then(() => this._toastr.success('Código de rastreio copiado!'))
      .catch(() => this._toastr.error('Não foi possível copiar o código.'));
  }

  public confirmBookReceived(param: MyRequestItem): void {
    const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: 450,
      data: {
        title: 'Confirmar recebimento',
        message: `Você confirma que recebeu o livro "${param.title}"?`,
        btnOkText: 'Sim, recebi',
        btnCancelText: 'Ainda não',
      },
    });

    confirmRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.isLoadingSubject.next(true);
      this._bookService
        .markAsDelivered(param.bookId)
        .pipe(
          takeUntil(this._destroySubscribes$),
          finalize(() => this.isLoadingSubject.next(false))
        )
        .subscribe(
          () => {
            this._toastr.success('Recebimento confirmado com sucesso.');
            this.buscarDados();
          },
          () => this._toastr.error('Não foi possível confirmar o recebimento.')
        );
    });
  }

  public get waitingDecisionCount(): number {
    return this.allRequestedBooks.filter(x => x.status === BookRequestStatus.AWAITING_ACTION).length;
  }

  public get wonCount(): number {
    return this.allRequestedBooks.filter(x => x.status === BookRequestStatus.DONATED).length;
  }

  public get finishedCount(): number {
    return this.allRequestedBooks.filter(x =>
      x.status === BookRequestStatus.REFUSED || x.status === BookRequestStatus.CANCELED
    ).length;
  }

  private applyFilters(): void {
    const filtered = this.allRequestedBooks.filter(request => {
      const matchesFilter = this.matchesFilter(request);
      const matchesSearch = !this.searchTerm ||
        `${request.title || ''} ${request.author || ''}`.toLocaleLowerCase().includes(this.searchTerm);

      return matchesFilter && matchesSearch;
    });

    this.requestedBooks.data = filtered;
  }

  private matchesFilter(request: MyRequestItem): boolean {
    switch (this.selectedFilter) {
      case 'awaiting':
        return request.status === BookRequestStatus.AWAITING_ACTION;
      case 'won':
        return request.status === BookRequestStatus.DONATED;
      case 'finished':
        return request.status === BookRequestStatus.REFUSED || request.status === BookRequestStatus.CANCELED;
      default:
        return true;
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
