import { Component, OnInit } from '@angular/core';
import { BrowserStorageService } from '../../core/services/platform/browser-storage.service';

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
  public consentHide: any;

  constructor(private _browserStorage: BrowserStorageService) {
    const status = this._browserStorage.getItem('cookieconsent_status');
    this.consentHide = status == null ? false : status;
  }

  ngOnInit() {}

  public consentUser(decision) {
    switch (decision) {
      case true:
        this._browserStorage.setItem('cookieconsent_status', 'true');
        this.consentHide = true;
        break;
      default:
        this.consentHide = true;
        break;
    }
  }
}
