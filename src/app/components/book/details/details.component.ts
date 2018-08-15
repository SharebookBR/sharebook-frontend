import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { UserService } from '../../../core/services/user/user.service';
import { AlertService } from '../../../core/services/alert/alert.service';
import { Book } from '../../../core/models/book';

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
  isLoading: Boolean = false;
  authenticated: Boolean = false;

  bookInfo: Book = new Book();
  categoryName: string;

  constructor(
    private _scBook: BookService,
    private _scCategory: CategoryService,
    private _scUser: UserService,
    private _activatedRoute: ActivatedRoute,
    private _scAlert: AlertService,
    private router: Router) {

    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.userProfile = this._scUser.getLoggedUserFromLocalStorage().profile;
    }
  }

  ngOnInit() {

    this.isLoading = true;

    this.getBookSaved();

    if (this.userProfile) {
      this.pageTitle = 'Tenho interesse na doação?';
    } else {
      this.pageTitle = 'Detalhes do Livro';
    }

  }

  getBookSaved() {
    let slug = '';
    this._activatedRoute.params.subscribe((param) => slug = param.slug);

    if (this.userProfile && slug) {
      this._scBook.getBySlug(slug).subscribe(x => {

        this.bookInfo = x;
        this.isLoading = false;

      }
      );
    } else {
      this.isLoading = false;
    }
  }

  onRequestBook() {
    this.isLoading = true;
    this._scBook.requestBook(this.bookInfo.id).subscribe(resp => {
      this.pageTitle = 'Aguarde a aprovação da doação!';
      this.isLoading = false;
      if (resp.success) {
        this._scAlert.success(resp.successMessage, true);
      } else {
        this._scAlert.error(resp.messages[0]);
      }
    },
    error => {
      this._scAlert.error(error);
    }
    );
  }

  onLoginBook() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this._activatedRoute.snapshot.url.join('/') }});
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
