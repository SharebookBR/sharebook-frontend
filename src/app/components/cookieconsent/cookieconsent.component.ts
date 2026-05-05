import { Component, OnInit } from '@angular/core';
import { BrowserStorageService } from 'src/app/core/services/platform/browser-storage.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookieconsent.component.html',
  styleUrls: ['./cookieconsent.component.scss'],
})
export class CookieConsentComponent implements OnInit {
  public consent: any = {
    text:
      'Esse site salva cookies para uma melhor experiência de usuário. Saiba mais lendo nossa',
    link: 'Política de Privacidade.',
    accept: 'Quero continuar',
    close: 'Fechar',
  };
  public consentHide: any = false;
  constructor(private _storage: BrowserStorageService) {}

  ngOnInit() {
    const status = this._storage.getItem('cookieconsent_status');
    this.consentHide = status == null ? false : status;
  }

  public consentUser(decision) {
    switch (decision) {
      case true:
        this._storage.setItem('cookieconsent_status', 'true');
        this.consentHide = true;
        break;
      default:
        this.consentHide = true;
        break;
    }
  }
}
