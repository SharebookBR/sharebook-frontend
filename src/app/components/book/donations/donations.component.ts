import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../../core/services/book/book.service';
import { BookDonationStatus } from '../../../core/models/BookDonationStatus';
import { TrackingComponent } from '../tracking/tracking.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DonateComponent } from '../donate/donate.component';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { getStatusDescription } from 'src/app/core/utils/getStatusDescription';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
})
export class DonationsComponent implements OnInit, OnDestroy {
  donatedBooks = new Array<any>();
  tableSettings: any;
  isLoading: boolean;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _bookService: BookService,
    private _sanitizer: DomSanitizer,
    private _modalService: NgbModal,
    private _toastr: ToastrService,
    private _confirmationDialogService: ConfirmationDialogService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

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

    const btnDonate =
      '<span class="btn btn-warning btn-sm ml-1 mb-1" data-toggle="tooltip" title="Escolher Donatário">' +
      ' <i class="fa fa-trophy"></i> </span>';
    const btnRenewChooseDate =
      '<span class="btn btn-info btn-sm ml-1 mb-1" data-toggle="tooltip" title="Renovar Data de Escolha">' +
      ' <i class="fa fa-calendar"></i> </span>';
    const btnTrackNumber =
      '<span class="btn btn-secondary btn-sm ml-1 mb-1" data-toggle="tooltip" title="Informar Código Rastreio">' +
      ' <i class="fa fa-truck"></i> </span>';

    this.tableSettings = {
      columns: {
        title: {
          title: 'Titulo',
          width: '27%',
        },
        totalInterested: {
          title: 'Total interessados',
          width: '08%',
        },
        daysInShowcase: {
          title: 'Dias na vitrine',
          width: '08%',
        },
        chooseDate: {
          title: 'Data Escolha',
          width: '10%',
          type: 'html',
          valuePrepareFunction: (cell, row) => {
            return new DatePipe('en-US').transform(cell, 'dd/MM/yyyy');
          },
        },
        trackingNumber: {
          title: 'Código Ratreio',
          width: '15%',
        },
        status: {
          title: 'Status',
          width: '15%',
          type: 'html',
          valuePrepareFunction: (value) => {
            return this._sanitizer.bypassSecurityTrustHtml(
              `<span class="badge badge-${this.getStatusBadge(
                value
              )}">${getStatusDescription(value)}</span>`
            );
          },
          filter: {
            type: 'list',
            config: {
              selectText: 'Selecionar...',
              list: myBookDonationStatus,
            },
          },
        },
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        update: false,
        custom: [
          {
            name: 'donate',
            title: btnDonate,
          },
          {
            name: 'renewChooseDate',
            title: btnRenewChooseDate,
          },
          {
            name: 'trackNumber',
            title: btnTrackNumber,
          },
        ],
        position: 'right', // left|right
      },
      attr: {
        class: 'table table-bordered table-hover table-striped',
      },
      noDataMessage: 'Nenhum registro encontrado.',
    };
  }

  private getStatusBadge(status) {
    switch (status) {
      case BookDonationStatus.WAITING_APPROVAL:
      case BookDonationStatus.WAITING_DECISION:
      case BookDonationStatus.WAITING_SEND:
      case BookDonationStatus.SENT:
        return 'warning';
      case BookDonationStatus.AVAILABLE:
      case BookDonationStatus.RECEIVED:
        return 'success';
      case BookDonationStatus.CANCELED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getDonations() {
    this.isLoading = true;

    this._bookService
      .getDonatedBooks()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((resp) => {
        this.donatedBooks = resp;
        this.isLoading = false;
      });
  }

  onCustom(event) {
    switch (event.action) {
      case 'donate': {
        if (event.data.status !== BookDonationStatus.WAITING_DECISION) {
          alert(
            `Não é possível escolher ganhador. \nstatus requerido = ${BookDonationStatus.WAITING_DECISION}\n` +
              `status atual = ${event.data.status}`
          );
          return;
        }

        const chooseDate = Math.floor(
          new Date(event.data.chooseDate).getTime() / (3600 * 24 * 1000)
        );
        const todayDate = Math.floor(new Date().getTime() / (3600 * 24 * 1000));

        if (!chooseDate || chooseDate - todayDate > 0) {
          alert('Aguarde a data de escolha!');
        } else {
          this._router.navigate([`book/donate/${event.data.id}`], {
            queryParams: {
              returnUrl: this._activatedRoute.snapshot.url.join('/'),
            },
          });
        }

        break;
      }
      case 'renewChooseDate': {
        if (event.data.status !== BookDonationStatus.WAITING_DECISION) {
          alert(
            `Não é possível renovar doação. \nstatus requerido = ${BookDonationStatus.WAITING_DECISION}\n` +
              `status atual = ${event.data.status}`
          );
          return;
        }

        const chooseDate = Math.floor(
          new Date(event.data.chooseDate).getTime() / (3600 * 24 * 1000)
        );
        const todayDate = Math.floor(new Date().getTime() / (3600 * 24 * 1000));

        if (!chooseDate || chooseDate - todayDate > 0) {
          alert('Aguarde a data de escolha!');
        } else {
          this._confirmationDialogService
            .confirm('Atenção!', 'Confirma a renovação da data de doação?')
            .then((confirmed) => {
              if (confirmed) {
                this._bookService
                  .renewChooseDate(event.data.id)
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
          event.data.status !== BookDonationStatus.WAITING_SEND &&
          event.data.status !== BookDonationStatus.SENT
        ) {
          alert(
            `Não é possível informar código de rastreio. \nstatus requerido = ${BookDonationStatus.WAITING_SEND} ` +
              `ou ${BookDonationStatus.SENT}\nstatus atual = ${event.data.status}`
          );
          return;
        }

        const modalRef = this._modalService.open(TrackingComponent, {
          backdropClass: 'light-blue-backdrop',
          centered: true,
        });

        modalRef.result.then(
          (result) => {
            if (result === 'Success') {
              this.getDonations();
            }
          },
          (reason) => {
            if (reason === 'Success') {
              this.getDonations();
            }
          }
        );

        modalRef.componentInstance.bookId = event.data.id;
        modalRef.componentInstance.bookTitle = event.data.title;
        modalRef.componentInstance.trackingNumber = event.data.trackingNumber;
        break;
      }
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
