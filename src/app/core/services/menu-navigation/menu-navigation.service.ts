import { Injectable } from '@angular/core';
import { MenuNavigation } from '../../models/menu-navigation.model';

@Injectable({
  providedIn: 'root'
})
export class MenuNavigationService {

  private paths: MenuNavigation[];

  constructor() {
    this.paths = [
      new MenuNavigation('Doe um livro', '/livros/doar'),
      new MenuNavigation('Apoie o projeto', '/apoie-projeto'),
      new MenuNavigation('Quem somos', '/quem-somos'),
      new MenuNavigation('Meu painel', '/panel'),
      new MenuNavigation('Fale Conosco', '/contact-us'),
    ];
  }

  public getMainMenuNavigation(): MenuNavigation[] {
    return this.paths;
  }

}
