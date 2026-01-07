import { Component, OnInit } from '@angular/core';

import { CardItem } from '../../core/models/card';
import { TechnologiesService } from '../../core/services/technologies/technologies.service';
import { ToolsService } from '../../core/services/tools/tools.service';
import { CareersService } from '../../core/services/careers/careers.service';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../core/services/seo/seo.service';

@Component({
  selector: 'app-contribute-project',
  templateUrl: './contribute-project.component.html',
  styleUrls: ['./contribute-project.component.css'],
  providers: [TechnologiesService, ToolsService, CareersService]
})
export class ContributeProjectComponent implements OnInit {
  technologies: CardItem[] = [];
  tools: CardItem[] = [];
  careers: CardItem[] = [];

  constructor(
    private technologiesService: TechnologiesService,
    private toolsService: ToolsService,
    private careersService: CareersService,
    private _seo: SeoService
  ) {}

  ngOnInit() {
    this._seo.generateTags({
      title: 'Apoie o projeto.',
      description:
        'Precisamos da sua ajuda. Tem muitas formas de ajudar. Todos são bem vindos, seja para contribuir ou aprender. ' +
        'Você pode ajudar contribuindo em nosso código-fonte open source. ' +
        'Temos .NET 10 no backend, Angular no front e Ionic no mobile. ' +
        'Você vai se sentir confortável porque temos um cuidado especial em ter um código limpo e fácil de entender. ' +
        'Acreditamos que cada commit conta uma estória, e que isso incentiva o aprendizado.',
      slug: 'apoie-projeto'
    });
    this.technologies = this.technologiesService.getTechnologies();
    this.tools = this.toolsService.getTools();
    this.careers = this.careersService.getCareers();
  }
}
