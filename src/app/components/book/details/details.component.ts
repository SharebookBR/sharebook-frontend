import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { UserService } from '../../../core/services/user/user.service';
import { AlertService } from '../../../core/services/alert/alert.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  formGroup: FormGroup;
  freightOptions: FreightOptions[] = [];
  categories: Category[] = [];

  userProfile: string;
  pageTitle: string;
  isLoading: Boolean = false;
  authenticated: Boolean = false;

  constructor(
    private _scBook: BookService,
    private _scCategory: CategoryService,
    private _scUser: UserService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _scAlert: AlertService) {

    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.userProfile = this._scUser.getLoggedUserFromLocalStorage().profile;
    }

    this.formGroup = _formBuilder.group({
      id: '',
      title: [{ value: '', disabled: true }],
      author: [{ value: '', disabled: true }],
      categoryId: [{ value: '', disabled: true }],
      freightOption: [''],
      imageBytes: [''],
      imageUrl: '',
      imageSlug: ''
    });
  }

  ngOnInit() {

    this.isLoading = true;

    this.getBookSaved();

    if (this.userProfile) {
      this.pageTitle = 'Tenho interesse na doação?';

      this._scBook.getFreightOptions().subscribe(data =>
        this.freightOptions = data
      );
    } else {
      this.pageTitle = 'Detalhes do Livro';
    }

    this._scCategory.getAll().subscribe(data =>
      this.categories = data
    );

  }

  getBookSaved() {
    let id = '';
    this._activatedRoute.params.subscribe((param) => id = param.id);

    if (this.userProfile && id) {
      this._scBook.getById(id).subscribe(x => {
        const bookForUpdate = {
          id: x.id,
          title: x.title,
          author: x.author,
          categoryId: x.categoryId,
          freightOption: x.freightOption,
          imageBytes: '',
          imageUrl: x.imageUrl,
          imageSlug: x.imageSlug
        };
        this.formGroup.setValue(bookForUpdate);
        this.isLoading = false;
      }
      );
    } else {
      this.isLoading = false;
    }
  }

  onRequestBook() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      this._scBook.requestBook(this.formGroup.value.id).subscribe(resp => {
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
  }

  onConvertImageToBase64(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = event => {
        const img = event.target['result'].split(',');
        this.formGroup.controls['imageBytes'].setValue(img[1]);
      };
    }
  }

}
