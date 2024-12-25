import { MyDonation } from '../../../core/models/MyDonation';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { BookService } from '../../../core/services/book/book.service';
import { BookDonationStatus } from '../../../core/models/BookDonationStatus';
import { TrackingComponent } from '../tracking/tracking.component';
import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';
import { WinnerUsersComponent } from '../winner-users/winner-users.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
})
export class DonationsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['title', 'totalInterested', 'daysInShowcase', 'chooseDate', 'trackingNumber', 'status', 'action'];
  donatedBooks = new MatTableDataSource<MyDonation>();

  tableSettings: any;

  statusBtnWinner: boolean;

  @ViewChild(MatSort) sort: MatSort;

  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private _bookService: BookService,
    private _toastr: ToastrService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
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

  ngAfterViewInit(): void {
    this.donatedBooks.sort = this.sort;
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
        this.donatedBooks.data = resp;
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
            `Não é possível renovar doação. \nstatus requerido = ${BookDonationStatus.WAITING_DECISION}\n` +
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
                message: 'Confirma a renovação da data de doação?',
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
                    this._toastr.success('Doação renovada com sucesso.');
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
        break;
      }

    }
  }

  public doFilter = (value: string) => {
    this.donatedBooks.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
