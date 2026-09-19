import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactUsVM } from 'src/app/core/models/ContactUsVM';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

  public contactUs(contactUsVM: ContactUsVM) {
    return this._http.post<any>(`${this.config.apiEndpoint}/ContactUs/SendMessage`, contactUsVM);
  }
}
