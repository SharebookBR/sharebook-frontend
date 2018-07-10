import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import fileUpload from 'fuctbase64';
import { ActivatedRoute } from '@angular/router';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { Book } from '../../../core/models/book';
import { tap } from '../../../../../node_modules/rxjs/operators';

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
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute) {

    this.formGroup = _formBuilder.group({
      id: '',
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      categoryId: ['', [Validators.required]],
      freightOption: ['', [Validators.required]],
    });
  }

  getBookSaved() {
    let id = '';
    this._activatedRoute.params.subscribe((param) => id = param.id);
    if (id) {
      this._scBook.getById(id).subscribe(x => {
          const foo = { 
            id: x.id,
            title: x.title,
            author: x.author,
            categoryId: x.categoryId,
            freightOption: x.freightOption,
          };
          console.log(foo)

          this.formGroup.setValue(foo);
        }
      );
    }

    // this.formGroup.setValue(book);
  }

  ngOnInit() {
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
      this._scBook.create(this.formGroup.value).subscribe(resp =>
        console.log(resp)
      );
    }
  }

  onChangeFieldFreightOption(freightOption) {
    this.formGroup.controls['freightOption'].setValue(freightOption);
  }

  onConvertImageToBase64(event) {
    if (event.target.value) {
      fileUpload(event).then(({base64}) => {
        const control = <FormArray>this.formGroup.controls['imageBytes'];
        control.setValue(base64);
      });
    }
  }
}
