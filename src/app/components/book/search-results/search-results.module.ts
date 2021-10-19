import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results.component';
import { Routes, RouterModule } from '@angular/router';
import { CardBookModule } from '../../card-book/card-book.module';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [
  {
    path: ':param',
    component: SearchResultsComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CardBookModule, MatPaginatorModule],
  declarations: [SearchResultsComponent]
})
export class SearchResultsModule { }
