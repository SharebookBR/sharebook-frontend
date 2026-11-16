import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/features/book/services/book.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { UserInfoBook } from 'src/app/features/book/UserInfoBook';
import { Book } from 'src/app/features/book/book';

@Component({
    selector: 'app-winner-users',
    templateUrl: './winner-users.component.html',
    styleUrls: ['./winner-users.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WinnerUsersComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;
  @Input() bookSlug;

  isLoading: Boolean;
  winnerUsers: (UserInfo | null)[] = [];
  donorInfo: UserInfo | null;
  bookInfo: Book;

  private _destroySubscribes$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<WinnerUsersComponent>, private _scBook: BookService) { }

  private removeDiacritics(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  ngOnInit() {
    this.isLoading = true;
    
    // Get book details
    this._scBook.getBySlug(this.bookSlug)
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

  contactWinnerOnWhatsapp(winnerUser: UserInfo) {
    const normalizedPhone = this.normalizeWhatsappPhone(winnerUser?.phone);
    if (!normalizedPhone) {
      return;
    }

    const message = `Olá, ${winnerUser.name}! Você ganhou o livro "${this.bookTitle}" no Sharebook.`;
    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  hasWhatsappPhone(winnerUser: UserInfo): boolean {
    return !!this.normalizeWhatsappPhone(winnerUser?.phone);
  }

  private normalizeWhatsappPhone(phone: string): string {
    if (!phone) {
      return '';
    }

    const onlyNumbers = phone.replace(/\D/g, '');
    if (!onlyNumbers) {
      return '';
    }

    if (onlyNumbers.startsWith('55')) {
      return onlyNumbers;
    }

    return `55${onlyNumbers}`;
  }

  generateEtiquetas(winnerUser: UserInfo) {
    if (!winnerUser || !this.donorInfo || !this.bookInfo) {
      return;
    }

    const formData = {
      "to": "4",
      "tipoImpressao": "1",
      // Sender (donor) information - first position
      "tipo_cep_1": "2",
      "cep_1": this.donorInfo.address?.postalCode || "",
      "cep_teste_1": this.donorInfo.address?.postalCode || "",
      "nome_1": this.removeDiacritics(this.donorInfo.name),
      "endereco_1": this.removeDiacritics(this.donorInfo.address?.street || ""),
      "numero_1": this.donorInfo.address?.number || "",
      "complemento_1": this.removeDiacritics(this.donorInfo.address?.complement || ""),
      "bairro_1": this.removeDiacritics(this.donorInfo.address?.neighborhood || ""),
      "cidade_1": this.removeDiacritics(this.donorInfo.address?.city || ""),
      "uf_1": this.donorInfo.address?.state || "",
      "selUf_1": this.donorInfo.address?.state || "",
      "empresa_1": "",
      "desEmpresa_1": "",
      "telefone_1": "",
      "desTelefone_1": "",

      // Recipient (winner) information
      "desTipo_cep_1": "2",
      "desCep_teste_1": winnerUser.address?.postalCode || "",
      "desCep_1": winnerUser.address?.postalCode || "",
      "desNome_1": this.removeDiacritics(winnerUser.name),
      "desEndereco_1": this.removeDiacritics(winnerUser.address?.street || ""),
      "desNumero_1": winnerUser.address?.number || "",
      "desComplemento_1": this.removeDiacritics(winnerUser.address?.complement || ""),
      "desBairro_1": this.removeDiacritics(winnerUser.address?.neighborhood || ""),
      "desCidade_1": this.removeDiacritics(winnerUser.address?.city || ""),
      "desUf_1": winnerUser.address?.state || "",
      "selDesUf_1": winnerUser.address?.state || "",
      "desDC_1": "\t\t\t\t\t\t",
      "num_1": "",

      // Empty data for positions 2-4 (required by the form)
      ...this.getEmptyPositionData(2),
      ...this.getEmptyPositionData(3),
      ...this.getEmptyPositionData(4)
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www2.correios.com.br/enderecador/encomendas/act/gerarEtiqueta.cfm?etq=1";
    form.target = "_blank";

    for (const [key, value] of Object.entries(formData)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  private getEmptyPositionData(position: number) {
    return {
      [`tipo_cep_${position}`]: "",
      [`cep_${position}`]: "",
      [`cep_teste_${position}`]: "",
      [`nome_${position}`]: "",
      [`endereco_${position}`]: "",
      [`numero_${position}`]: "",
      [`complemento_${position}`]: "",
      [`bairro_${position}`]: "",
      [`cidade_${position}`]: "",
      [`uf_${position}`]: "",
      [`selUf_${position}`]: "",
      [`empresa_${position}`]: "",
      [`desEmpresa_${position}`]: "",
      [`telefone_${position}`]: "",
      [`desTelefone_${position}`]: "",
      [`desTipo_cep_${position}`]: "",
      [`desCep_teste_${position}`]: "",
      [`desCep_${position}`]: "",
      [`desNome_${position}`]: "",
      [`desEndereco_${position}`]: "",
      [`desNumero_${position}`]: "",
      [`desComplemento_${position}`]: "",
      [`desBairro_${position}`]: "",
      [`desCidade_${position}`]: "",
      [`desUf_${position}`]: "",
      [`selDesUf_${position}`]: "",
      [`desDC_${position}`]: "\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t",
      [`num_${position}`]: ""
    };
  }
}
