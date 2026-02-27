import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css'],
})
export class InputSearchComponent implements OnInit {
  public searchForm: FormGroup;
  public searchAlert = false;

  @ViewChild('alert') alert: ElementRef;

  constructor(private fb: FormBuilder, private _router: Router) {}

  ngOnInit() {
    const pathParts = window.location.pathname.split('/search/');
    const currentSearch = pathParts.length > 1 ? decodeURIComponent(pathParts[1]) : '';
    this.searchForm = this.fb.group({
      paramSearch: [currentSearch, [Validators.minLength(3)]],
    });
  }

  public search(): void {
    // verifica se há alguma coisa na busca - senão houver exibe um alerta e não direciona pesquisa
    if (this.searchForm.value.paramSearch) {
      window.location.href = `/search/${this.searchForm.value.paramSearch}`;
      this.searchAlert = false;
    } else {
      this.searchAlert = true;
    }
  }

  // remove o alerta, e joga para a home do site ajustando o menu novamente sem o alerta
  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this._router.navigate(['/']);
    this.searchAlert = false;
  }
}
