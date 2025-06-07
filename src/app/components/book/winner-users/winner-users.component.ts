import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { UserInfoBook } from 'src/app/core/models/UserInfoBook';
import { BookToAdminProfile } from 'src/app/core/models/BookToAdminProfile';

@Component({
  selector: 'app-winner-users',
  templateUrl: './winner-users.component.html',
  styleUrls: ['./winner-users.component.css']
})
export class WinnerUsersComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;

  isLoading: Boolean;
  winnerUsers: UserInfo[] = [];
  donorInfo: UserInfo;
  bookInfo: BookToAdminProfile;

  private _destroySubscribes$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<WinnerUsersComponent>, private _scBook: BookService) { }

  private removeDiacritics(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  ngOnInit() {
    this.isLoading = true;
    
    // Get book details
    this._scBook.getById(this.bookId)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (book) => {
          this.bookInfo = book;
        }
      );

    // Get users information
    this._scBook.getMainUsers(this.bookId)
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(
        (resp: UserInfoBook) => {
          this.isLoading = false;
          this.winnerUsers[0] = !!resp.winner ? resp.winner : null;
          this.donorInfo = !!resp.donor ? resp.donor : null;
        },
        error => {
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  generateDeclaracao(winnerUser: UserInfo) {
    if (!winnerUser || !this.donorInfo || !this.bookInfo) {
      return;
    }

    const baseUrl = 'https://www2.correios.com.br/enderecador/encomendas/dsp/formDeclaracao.cfm';
    const params = new URLSearchParams();
    
    // Recipient information (winner)
    params.set('desNome', this.removeDiacritics(winnerUser.name));
    params.set('desEndereco', this.removeDiacritics(winnerUser.address?.street || ''));
    params.set('desComplemento', this.removeDiacritics(winnerUser.address?.complement || ''));
    params.set('desBairro', this.removeDiacritics(winnerUser.address?.neighborhood || ''));
    params.set('desCidade', this.removeDiacritics(winnerUser.address?.city || ''));
    params.set('desUf', winnerUser.address?.state || '');
    params.set('desCep', winnerUser.address?.postalCode || '');
    params.set('desNumero', winnerUser.address?.number || '');
    params.set('desCnpjcpf', '');

    // Sender information (donor)
    params.set('nome', this.removeDiacritics(this.donorInfo.name));
    params.set('endereco', this.removeDiacritics(this.donorInfo.address?.street || ''));
    params.set('complemento', this.removeDiacritics(this.donorInfo.address?.complement || ''));
    params.set('bairro', this.removeDiacritics(this.donorInfo.address?.neighborhood || ''));
    params.set('cidade', this.removeDiacritics(this.donorInfo.address?.city || ''));
    params.set('uf', this.donorInfo.address?.state || '');
    params.set('cep', this.donorInfo.address?.postalCode || '');
    params.set('numero', this.donorInfo.address?.number || '');
    params.set('cnpjcpf', '');

    // Other required parameters
    params.set('pdf', 's');

    // Book information - using loop for items
    for (let i = 1; i <= 6; i++) {
      if (i === 1) {
        params.set(`item${i}`, '1');
        params.set(`cont${i}`, this.removeDiacritics(`Livro Doacao: ${this.bookInfo.title} - ${this.bookInfo.author}`));
        params.set(`quant${i}`, '1');
        params.set(`val${i}`, '0');
      } else {
        // Necessário para não dar erro na página dos correios - eles esperam 6 items
        params.set(`item${i}`, '');
        params.set(`cont${i}`, '');
        params.set(`quant${i}`, '');
        params.set(`val${i}`, '');
      }
    }
    
    params.set('pesototal', '1');

    const url = `${baseUrl}?${params.toString()}`;
    window.open(url, '_blank');
  }
}
