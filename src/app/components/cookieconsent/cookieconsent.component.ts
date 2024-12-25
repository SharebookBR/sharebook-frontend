import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookieconsent.component.html',
  styleUrls: ['./cookieconsent.component.scss'],
})
export class CookieConsentComponent {
  public consent: any = {
    text:
      'Esse site salva cookies para uma melhor experiência de usuário. Saiba mais lendo nossa',
    link: 'Política de Privacidade.',
    accept: 'Quero continuar',
    close: 'Fechar',
  };
  public consentHide: any =
    localStorage.getItem('cookieconsent_status') == null
      ? false
      : localStorage.getItem('cookieconsent_status');
  constructor() {}


  public consentUser(decision) {
    switch (decision) {
      case true:
        localStorage.setItem('cookieconsent_status', 'true');
        this.consentHide = true;
        break;
      default:
        this.consentHide = true;
        break;
    }
  }
}
