import { Routes } from '@angular/router';
import { BookService } from './../../core/services/book/book.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';

const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomePageComponent
  }
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HomePageComponent],
  providers: [
    BookService
  ]
})
export class HomePageModule { }
