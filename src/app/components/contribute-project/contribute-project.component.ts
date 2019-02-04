import { Component, OnInit } from '@angular/core';

import { CardItem } from '../../core/models/card';
import { TechnologiesService } from '../../core/services/technologies/technologies.service';
import { ToolsService } from '../../core/services/tools/tools.service';
import { CareersService } from '../../core/services/careers/careers.service';

@Component({
  selector: 'app-contribute-project',
  templateUrl: './contribute-project.component.html',
  styleUrls: ['./contribute-project.component.css'],
  providers: [
    TechnologiesService,
    ToolsService,
    CareersService
  ]
})
export class ContributeProjectComponent implements OnInit {

  technologies: CardItem[] = [];
  tools: CardItem[] = [];
  careers: CardItem[] = [];

  constructor(
    private technologiesService: TechnologiesService,
    private toolsService: ToolsService,
    private careersService: CareersService) { }

  ngOnInit() {
    this.technologies = this.technologiesService.getTechnologies();
    this.tools = this.toolsService.getTools();
    this.careers = this.careersService.getCareers();
  }

}
