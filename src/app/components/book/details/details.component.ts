import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../../core/services/book/book.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { UserService } from '../../../core/services/user/user.service';
import { Book } from '../../../core/models/book';

import { MatDialog } from '@angular/material/dialog';
import { RequestComponent } from '../request/request.component';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { SeoService } from '../../../core/services/seo/seo.service';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  freightOptions: FreightOptions[] = [];
  categories: Category[] = [];

  userProfile: string;
  pageTitle: string;
  state = 'loading';
  authenticated: Boolean = false;
  requested: Boolean = false;
  available: Boolean = false;

  myUser: UserInfo = new UserInfo();
  bookInfo: Book = new Book();
  categoryName: string;
  freightName: string;
  isFreeFreight: Boolean = true;
  daysToChoose: number;
  chooseDateInfo: string;
  isCheckedFreight: boolean;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _scUser: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _scAuthentication: AuthenticationService,
    private _seo: SeoService
  ) {
    this._scAuthentication.checkTokenValidity();
  }

  ngOnInit() {
    this.state = 'loading';
    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.userProfile = this._scUser.getLoggedUserFromLocalStorage().profile;
      this.getMyUser();
    } else {
      this.getBook();
    }
  }

  getMyUser() {
    this._scUser
      .getUserData()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((x) => {
        this.myUser = x;
        this.getBook();
      });
  }

  getBook() {
    let slug = '';
    this._activatedRoute.params
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((param) => (slug = param.slug));

    if (slug) {
      this._scBook
        .getBySlug(slug)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(
          (book) => {
            this._scBook
              .getFreightOptions()
              .pipe(takeUntil(this._destroySubscribes$))
              .subscribe((data) => {
                this.freightOptions = data;

                this.freightName = book.freightOption;

                this.bookInfo = book;
                this.pageTitle = this.bookInfo.title;
                this.available =
                  this.bookInfo.status === BookDonationStatus.AVAILABLE;

                const chooseDate = Math.floor(
                  new Date(this.bookInfo.chooseDate).getTime() /
                  (3600 * 24 * 1000)
                );
                const todayDate = Math.floor(
                  new Date().getTime() / (3600 * 24 * 1000)
                );

                this.daysToChoose = chooseDate - todayDate;
                const daysLeftMessage = (this.daysToChoose && this.daysToChoose > 1)
                  ? 'Daqui a ' + this.daysToChoose + ' dias'
                  : 'Daqui a 1 dia';
                const isToday = (!this.daysToChoose || this.daysToChoose <= 0);
                this.chooseDateInfo = isToday ? 'Hoje' : daysLeftMessage;


                if (this.myUser.name) {
                  switch (book.freightOption) {
                    case 'City': {
                      if (book.city !== this.myUser.address.city) {
                        this.isFreeFreight = false;
                      }
                      break;
                    }
                    case 'State': {
                      if (book.state !== this.myUser.address.state) {
                        this.isFreeFreight = false;
                      }
                      break;
                    }
                    case 'WithoutFreight': {
                      this.isFreeFreight = false;
                      break;
                    }
                    default: {
                      this.isFreeFreight = true;
                    }
                  }
                }

                if (this.userProfile) {
                  this._scBook
                    .getRequested(book.id)
                    .pipe(takeUntil(this._destroySubscribes$))
                    .subscribe((requested) => {
                      this.requested = requested.value.bookRequested;
                      this.state = 'ready';
                    });
                } else {
                  this.state = 'ready';
                }

                this._seo.generateTags({
                  title: this.bookInfo.title,
                  description: this.bookInfo.synopsis,
                  image: this.bookInfo.imageUrl,
                  slug: slug,
                });
              });
          },
          (err) => {
            console.error(err);
            this.pageTitle = 'Ops... Não encontramos esse livro :/';
            this.state = 'not-found';
          }
        );
    } else {
      this.pageTitle = 'Ops... Não encontramos esse livro :/';
      this.state = 'not-found';
    }
  }

  onRequestBook() {
    const modalRef = this.dialog.open(RequestComponent, { minWidth: 450 });

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.requested = true;
      }
    });

    modalRef.componentInstance.bookId = this.bookInfo.id;
  }

  onLoginBook() {
    this._router.navigate(['/login'], {
      queryParams: { returnUrl: this._activatedRoute.snapshot.url.join('/') },
    });
  }

  onConvertImageToBase64(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event) => {
        const img = (<string>event.target['result']).split(',');
        this.bookInfo.imageBytes = img[1];
      };
    }
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
