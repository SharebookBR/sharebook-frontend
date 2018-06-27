import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../../core/services/book/book.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  formGroup: FormGroup;
  freightOptions: any;

  constructor(
    private _service: BookService,
    private _formBuilder: FormBuilder
  ) {

    this.formGroup = _formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      category: ['', [Validators.required]],
      customFile: ['', [Validators.required]],
      freightOption: ['', [Validators.required]],
    });

    this.freightOptions = [
      { value: 'no', label: 'Não pagaria' },
      { value: 'city', label: 'Cidade' },
      { value: 'state', label: 'Estado' },
      { value: 'country', label: 'Pais' },
      { value: 'world', label: 'Mundo' }
    ];
  }

  ngOnInit() {  }

  addBook() {
    if (this.formGroup.valid) {
      this._service.create(this.formGroup.value).subscribe();
    }
  }

  changeFieldFreightOption(option) {
    this.formGroup.controls['freightOption'].setValue(option);
  }
}
