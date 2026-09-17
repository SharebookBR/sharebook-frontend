import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PlatformService } from 'src/app/core/services/platform/platform.service';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css'],
})
export class InputSearchComponent implements OnInit {
  public searchForm: FormGroup;
  public searchAlert = false;

  @ViewChild('alert') alert: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @Output() searchSubmitted = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _platform: PlatformService,
  ) {}

  ngOnInit() {
    const pathname = this._platform.getPathname();
    const pathParts = pathname.split('/buscar/');
    const currentSearch = pathParts.length > 1 ? decodeURIComponent(pathParts[1]) : '';
    this.searchForm = this.fb.group({
      paramSearch: [currentSearch],
    });
  }

  public search(): void {
    // verifica se há alguma coisa na busca - senão houver exibe um alerta e não direciona pesquisa
    const term = this.searchForm.value.paramSearch?.trim();
    if (term) {
      this._router.navigate(['/buscar', term]);
      this.searchAlert = false;
      this.searchSubmitted.emit(term);
    } else {
      this.searchAlert = true;
    }
  }

  focus(): void {
    this.searchInput?.nativeElement.focus();
  }

  // remove o alerta, e joga para a home do site ajustando o menu novamente sem o alerta
  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this._router.navigate(['/']);
    this.searchAlert = false;
  }
}
