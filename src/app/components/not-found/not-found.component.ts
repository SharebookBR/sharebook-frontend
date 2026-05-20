import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private _seo: SeoService) { }

  ngOnInit(): void {
    this._seo.generateTags({
      title: 'Página não encontrada',
      description: 'Ops! A página que você está procurando não existe ou foi movida.',
    });
  }
}
