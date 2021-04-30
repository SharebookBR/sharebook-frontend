import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results.component';
import { Routes, RouterModule } from '@angular/router';
import { CardBookModule } from '../../card-book/card-book.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: ':param',
    component: SearchResultsComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CardBookModule, NgbPaginationModule],
  declarations: [SearchResultsComponent]
})
export class SearchResultsModule {}
