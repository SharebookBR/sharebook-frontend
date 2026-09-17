import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';

import { BookService } from 'src/app/core/services/book/book.service';
import { UserInfoBook } from 'src/app/core/models/UserInfoBook';
import { UserInfo } from 'src/app/core/models/userInfo';

@Component({
  selector: 'app-donor-modal',
  templateUrl: './donor-modal.component.html',
  styleUrls: ['./donor-modal.component.css'],
})
export class DonorModalComponent implements OnInit {
  @Input() bookId;
  @Input() bookTitle;
  @Input() messageBody;
  loading: boolean;

  userInfo$: Observable<UserInfoBook>;

  constructor(public dialogRef: MatDialogRef<DonorModalComponent>, private readonly _bookService: BookService) {}

  contactOnWhatsapp(user: UserInfo) {
    const normalizedPhone = this.normalizeWhatsappPhone(user?.phone);
    if (!normalizedPhone) {
      return;
    }

    const message = `Olá, ${user.name}! Aqui é do Sharebook sobre o livro "${this.bookTitle}".`;
    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  hasWhatsappPhone(user: UserInfo): boolean {
    return !!this.normalizeWhatsappPhone(user?.phone);
  }

  ngOnInit() {
    this.loading = true;
    if (this.messageBody === '') {
      this.getDonor();
    } else {
      this.loading = false;
    }
  }

  private getDonor() {
    this.userInfo$ = this._bookService.getMainUsers(this.bookId).pipe(
      map((userInfo) => {
        this.loading = false;
        return userInfo;
      })
    );
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
}
