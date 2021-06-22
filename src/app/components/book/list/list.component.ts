import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
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

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['creationDate',
    'chooseDate',
    'title',
    'users',
    'status',
    'action'];

  myBookArray = new MatTableDataSource<BookVMItem>();
  statusSearchValues = [];

  private _destroySubscribes$ = new Subject<void>();
  public isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _scBook: BookService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.myBookArray.sort = this.sort;
    this.myBookArray.paginator = this.paginator;
  }

  getAllBooks() {
    this.isLoadingSubject.next(true);
    this._scBook
      .getAll()
      .pipe(
        takeUntil(this._destroySubscribes$),
        finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((resp: BookVM) => {
        this.myBookArray.data = resp.items;
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

        modalRef.afterClosed().subscribe(result => {
          if (result) {
            this.reloadData();
          }
        });

        modalRef.componentInstance.bookId = param.id;
        modalRef.componentInstance.bookTitle = param.title;
        modalRef.componentInstance.facilitatorNotes = (param.facilitatorNotes === null) ? '' : param.facilitatorNotes;
        break;
      }
      case 'trackNumber': {
        if (
          param.status !== BookDonationStatus.WAITING_SEND &&
          param.status !== BookDonationStatus.SENT
        ) {
          alert(
            `Não é possível informar código de rastreio. \nstatus requerido = ${BookDonationStatus.WAITING_SEND} ou` +
            `${BookDonationStatus.SENT}\nstatus atual = ${param.status}`
          );
          return;
        }

        const modalRef = this.dialog.open(TrackingComponent, { minWidth: 550 });

        modalRef.afterClosed().subscribe(result => {
          if (result) {
            this.reloadData();
          }
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

  reloadData() {
    this.getAllBooks();
  }

  public doFilter = (value: string) => {
    this.myBookArray.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  searchByStatus(status: string) {
    this.doFilter(status);
  }

  search(searchStr: string) {
    const mySelect = document.getElementById('selectSearchByStatus') as HTMLInputElement;
    mySelect.value = '';
    this.doFilter(searchStr);
  }
}
