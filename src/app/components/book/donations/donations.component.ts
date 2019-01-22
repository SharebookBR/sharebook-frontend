import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from '../../../core/services/book/book.service';
import { BookDonationStatus } from '../../../core/models/BookDonationStatus';
import { TrackingComponent } from '../tracking/tracking.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donatedBooks = new Array<any>();
  tableSettings: any;
  isLoading: boolean;

  constructor(
    private _bookService: BookService,
    private _sanitizer: DomSanitizer,
    private _modalService: NgbModal
  ) { }

  ngOnInit() {

    this.getDonations();

    const btnTrackNumber = '<span class="btn btn-secondary btn-sm" data-toggle="tooltip" title="Informar Código Rastreio">' +
                           ' <i class="fa fa-truck"></i> </span>&nbsp;';

    this.tableSettings = {
      columns: {
        title: {
          title: 'Titulo',
          width: '50%'
        },
        totalInterested: {
          title: 'Total interessados',
          width: '15%'
        },
        daysInShowcase: {
          title: 'Dias na vitrine',
          width: '15%'
        },
        trackingNumber: {
          title: 'Código Ratreio',
          width: '15%',
        },
        status: {
          title: 'Status',
          width: '15%',
          type: 'html',
          valuePrepareFunction: value =>
            this._sanitizer.bypassSecurityTrustHtml(`<span class="badge badge-${this.getStatusBadge(value)}">${value}</span>`),
        }
      },
      actions: {
        delete: false,
        edit: false,
        add: false,
        update: false,
        custom: [
          {
            name: 'trackNumber',
            title: btnTrackNumber,
          }
        ],
        position: 'right' // left|right
      },
      attr: {
        class: 'table table-bordered table-hover table-striped'
      },
      noDataMessage: 'Nenhum registro encontrado.'
    };
  }

  private getStatusBadge(status) {
    switch (status) {
      case BookDonationStatus.UNKNOW:
        return 'secondary';
      case BookDonationStatus.WAITING_APPROVAL:
        return 'warning';
      case BookDonationStatus.AVAILABLE:
        return 'primary';
      case BookDonationStatus.INVISIBLE:
        return 'light';
      case BookDonationStatus.DONATED:
        return 'success';
    }
  }

  getDonations() {
    this.isLoading = true;

    this._bookService.getDonatedBooks().subscribe(resp => {
      this.donatedBooks = resp;
      this.isLoading = false;
    });
  }

  onCustom(event) {
    console.log(event.data);
    switch (event.action) {
      case 'trackNumber': {
        if (!event.data.donated) {
          alert('Livro deve estar como doado!');
        } else {
          const modalRef = this._modalService.open(TrackingComponent, { backdropClass: 'light-blue-backdrop', centered: true });

          modalRef.result.then((result) => {
            if (result === 'Success') {
              this.getDonations();
            }
          }, (reason) => {
            if (reason === 'Success') {
              this.getDonations();
            }
          });

          modalRef.componentInstance.bookId         = event.data.id;
          modalRef.componentInstance.bookTitle      = event.data.title;
          modalRef.componentInstance.trackingNumber = event.data.trackingNumber;
          break;
        }
      }
    }
  }
}
