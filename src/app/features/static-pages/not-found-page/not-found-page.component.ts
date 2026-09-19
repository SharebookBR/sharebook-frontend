import { Component, Inject, OnInit, Optional, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RESPONSE } from 'src/express.tokens';
import { Response } from 'express';
import { SeoService } from 'src/app/core/services/seo/seo.service';

@Component({
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NotFoundPageComponent implements OnInit {
  constructor(
    @Optional() @Inject(RESPONSE) private response: Response,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _seo: SeoService
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId) && this.response) {
      this.response.status(404);
    }
    this._seo.generateTags({
      title: 'Página não encontrada',
      description: 'Ops! A página que você está procurando não existe ou foi movida.',
    });
  }
}
