import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  formGroup: FormGroup;
  freightOptions: FreightOptions[] = [];
  categories: Category[] = [];
  isSaved: boolean;

  constructor(
    private _scBook: BookService,
    private _scCategory: CategoryService,
    private _scUser: UserService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute) {

    this.formGroup = _formBuilder.group({
      id: '',
      userId: '',
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      categoryId: ['', [Validators.required]],
      freightOption: ['', [Validators.required]],
      imageBytes: [''],
      imageUrl: ['', [Validators.required]],
    });
  }

  getBookSaved() {
    let id = '';
    this._activatedRoute.params.subscribe((param) => id = param.id);
    if (id) {
      this._scBook.getById(id).subscribe(x => {
          const foo = {
            id: x.id,
            userId: x.userId,
            title: x.title,
            author: x.author,
            categoryId: x.categoryId,
            freightOption: x.freightOption,
            imageBytes: '',
            imageUrl: x.imageUrl
          };
          this.formGroup.setValue(foo);
        }
      );
    }
  }

  ngOnInit() {
    this.formGroup.patchValue({ userId: this._scUser.getLoggedUserFromLocalStorage().userId });

    this._scBook.getFreightOptions().subscribe(data =>
      this.freightOptions = data
    );

    this._scCategory.getAll().subscribe(data =>
      this.categories = data
    );

    this.getBookSaved();
  }

  onAddBook() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
      if (!this.formGroup.value.id) {
        this._scBook.create(this.formGroup.value).subscribe(resp =>
          console.log(resp)
        );
      } else {
        this._scBook.update(this.formGroup.value).subscribe(resp =>
          console.log(resp)
        );
      }
    }
  }

  onChangeFieldFreightOption(freightOption: string) {
    this.formGroup.controls['freightOption'].setValue(freightOption);
  }

  onConvertImageToBase64(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const image = event.target.value;

      reader.readAsDataURL(event.target.files[0]);
      this.formGroup.controls['imageUrl'].setValue(image);

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = event => {
        this.formGroup.controls['imageBytes'].setValue(event.target['result']);
      };
    }
  }
}
