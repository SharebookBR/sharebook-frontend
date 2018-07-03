import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../../app-config.module';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private _http: HttpClient,  @Inject(APP_CONFIG) private config: AppConfig) { }

  public getAll() {
    return this._http.get<any>(`${this.config.apiEndpoint}/category`)
    .pipe(map(response => {
      return response.items;
    }));
  }

  public getById(categoryId: number) {
    return this._http.get<Category>(`${this.config.apiEndpoint}/category/${categoryId}`);
  }
}
