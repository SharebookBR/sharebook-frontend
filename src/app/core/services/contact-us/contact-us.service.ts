import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactUsVW } from '../../models/ContactUsVW';



import { APP_CONFIG, AppConfig } from '../../../app-config.module';
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

   constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

   public contactUs(contactUsVW: ContactUsVW) {
     return this._http.post<any>(`${this.config.apiEndpoint}/contactus`, contactUsVW);
   }
}

