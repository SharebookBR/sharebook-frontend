import { Component, OnInit } from '@angular/core';

import { Contributor } from 'src/app/core/models/contributor';
import { ContributorsService } from 'src/app/core/services/contributors/contributors.service';
import { SeoService } from '../../core/services/seo/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [ContributorsService]
})
export class AboutComponent implements OnInit {
  contributors: Contributor[] = [];

  historicoFotos = [
    { src: 'assets/img/about/fundacao.jpeg', legenda: '6 de abril de 2018 — o dia em que tudo começou.' },
    { src: 'assets/img/about/lancamento.jpeg', legenda: '11 de agosto de 2018 — lançamento do app.' },
  ];
  fotoAtual = 0;

  avancarFoto(dir: number) {
    this.fotoAtual = (this.fotoAtual + dir + this.historicoFotos.length) % this.historicoFotos.length;
  }

  constructor(private contributorsService: ContributorsService, private _seo: SeoService) {}

  ngOnInit() {
    this._seo.generateTags({
      title: 'Quem somos.',
      description:
        'Sharebook é um projeto social. Um app livre e gratuito para ajudar as pessoas a doar ou ganhar livros.' +
        'Foi fundado pelo Raffaello Damgaard após conversar com Vagner Nunes que incentivou a ideia. ' +
        'Centenas de livros já foram doados em nossa plataforma. Em cada um deles temos muito orgulho e incentivo de continuar em frente.',
      slug: 'quem-somos'
    });
    this.contributors = this.contributorsService.getContributors();
  }
}
