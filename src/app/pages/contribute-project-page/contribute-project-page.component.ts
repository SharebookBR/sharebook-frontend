import { CareersService } from './../../core/services/careers/careers.service';
import { CardItem } from './../../core/models/card';
import { Component, OnInit } from '@angular/core';
import { TechnologiesService } from 'src/app/core/services/technologies/technologies.service';
import { ToolsService } from 'src/app/core/services/tools/tools.service';

@Component({
  selector: 'app-contribute-project-page',
  templateUrl: './contribute-project-page.component.html',
  styleUrls: ['./contribute-project-page.component.css']
})
export class ContributeProjectPageComponent implements OnInit {

  technologies: CardItem[] = [];
  tools: CardItem[] = [];
  careers: CardItem[] = [];

  constructor(
    private _technologiesService: TechnologiesService,
    private _toolsService: ToolsService,
    private _careersService: CareersService) { }

  ngOnInit() {
    this.technologies = this._technologiesService.getTechnologies();
    this.tools = this._toolsService.getTools();
    this.careers = this._careersService.getCareers();
  }

}
