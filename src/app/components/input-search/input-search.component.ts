import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css']
})
export class InputSearchComponent implements OnInit {
  public searchForm: FormGroup;

  constructor(private fb: FormBuilder, private _router: Router) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      paramSearch: ['', [Validators.minLength(3)]]
    });
  }

  public search(): void {
    this._router.navigate(['/book/search', this.searchForm.value.paramSearch]);
  }
}
