import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { TagVM } from 'src/app/features/tag/tag';
import { Book } from 'src/app/features/book/book';

export interface TagBooksPage {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items?: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  public getTags(): Observable<TagVM[]> {
    return this._http.get<TagVM[]>(`${this.config.apiEndpoint}/tag`);
  }

  public getTag(idOrAlias: string): Observable<TagVM> {
    return this._http.get<TagVM>(`${this.config.apiEndpoint}/tag/${encodeURIComponent(idOrAlias)}`);
  }

  public getBooksByTag(idOrAlias: string, page: number = 1, items: number = 100): Observable<TagBooksPage> {
    return this._http.get<TagBooksPage>(
      `${this.config.apiEndpoint}/tag/${encodeURIComponent(idOrAlias)}/Books/${page}/${items}`
    );
  }
}
