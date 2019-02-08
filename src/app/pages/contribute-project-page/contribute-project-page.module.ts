import { CareersService } from './../../core/services/careers/careers.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributeProjectPageComponent } from './contribute-project-page.component';
import { TechnologiesService } from 'src/app/core/services/technologies/technologies.service';
import { ToolsService } from 'src/app/core/services/tools/tools.service';

const CONTRIBUTE_ROUTES: Routes = [
  {
    path: '',
    component: ContributeProjectPageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CONTRIBUTE_ROUTES)
  ],
  declarations: [ContributeProjectPageComponent],
  providers: [
    TechnologiesService,
    ToolsService,
    CareersService
  ]
})
export class ContributeProjectPageModule { }
