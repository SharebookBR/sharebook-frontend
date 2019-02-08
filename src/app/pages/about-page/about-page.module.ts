import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContributorsService } from './../../core/services/contributors/contributors.service';
import { AboutPageComponent } from './about-page.component';

const ABOUT_ROUTES: Routes = [
  {
    path: '',
    component: AboutPageComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ABOUT_ROUTES)
  ],
  declarations: [AboutPageComponent],
  providers: [
    ContributorsService
  ]
})
export class AboutPageModule {}
