import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from '../../../core/services/book/book.service';
import { BookDonationStatus } from '../../../core/models/BookDonationStatus';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donatedBooks = new Array<any>();
  tableSettings: any;

  constructor(
    private _bookService: BookService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this._bookService.getDonatedBooks().subscribe(resp => {
      this.donatedBooks = resp;
    });

    this.tableSettings = {
      columns: {
        title: {
          title: 'Titulo',
          width: '50%'
        },
        totalInterested: {
          title: 'Total de interessados',
          width: '20%'
        },
        daysInShowcase: {
          title: 'Dias na vitrine',
          width: '15%'
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
        update: false
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
}
