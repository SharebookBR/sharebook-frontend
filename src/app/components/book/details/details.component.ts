import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BookService } from '../../../core/services/book/book.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { UserService } from '../../../core/services/user/user.service';
import { Book } from '../../../core/models/book';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestComponent } from '../request/request.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  freightOptions: FreightOptions[] = [];
  categories: Category[] = [];

  userProfile: string;
  pageTitle: string;
  state = 'loading';
  authenticated: Boolean = false;
  requested: Boolean = false;
  available: Boolean = false;

  bookInfo: Book = new Book();
  categoryName: string;
  freightName: string;

  constructor(
    private _scBook: BookService,
    private _scUser: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _modalService: NgbModal) {

    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.userProfile = this._scUser.getLoggedUserFromLocalStorage().profile;
    }
  }

  ngOnInit() {
    this.state = 'loading';
    this.getBook();
  }

  getBook() {
    let slug = '';
    this._activatedRoute.params.subscribe((param) => slug = param.slug);

    if (slug) {
      this._scBook.getBySlug(slug).subscribe(x => {

        this._scBook.getFreightOptions().subscribe(data => {
          this.freightOptions = data;

          const name = this.freightOptions.find(obj => obj.value.toString() === x.freightOption.toString());
          this.freightName = name.text;

          this.bookInfo = x;
          this.pageTitle = this.bookInfo.title;
          this.available = this.bookInfo.approved;

          if (this.userProfile) {
            this._scBook.getRequested(x.id).subscribe(requested => {
              this.requested = requested.value.bookRequested;
              this.state = 'ready';
            });
          } else {
            this.state = 'ready';
          }
        });
      }
      , err => {
        console.error(err);
        this.pageTitle = 'Ops... Não encontramos esse livro :/';
        this.state = 'not-found';
      });
    } else {
      this.pageTitle = 'Ops... Não encontramos esse livro :/';
      this.state = 'not-found';
    }
  }

  onRequestBook() {
    const modalRef = this._modalService.open(RequestComponent, { backdropClass: 'light-blue-backdrop', centered: true });

    modalRef.result.then((result) => {
      if (result === 'Success') {
        this.requested = true;
      }
    }, (reason) => {
      if (reason === 'Success') {
        this.requested = true;
      }
    });

    modalRef.componentInstance.bookId = this.bookInfo.id;
    modalRef.componentInstance.creationDate = this.bookInfo.creationDate;
  }

  onLoginBook() {
    this._router.navigate(['/login'], { queryParams: { returnUrl: this._activatedRoute.snapshot.url.join('/') } });
  }

  onConvertImageToBase64(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = event => {
        const img = event.target['result'].split(',');
        this.bookInfo.imageBytes = img[1];
      };
    }
  }

}
