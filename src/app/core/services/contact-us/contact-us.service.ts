import { Injectable, Inject } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { ContactUsVM } from '../../models/ContactUsVM';



import { APP_CONFIG, AppConfig } from '../../../app-config.module';
import { PARAMETERS } from '@angular/core/src/util/decorators';
@Injectable({
  providedIn: 'root'
})

export class ContactUsService {

  private params :HttpParams;

   constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

   public contactUs(contactUsVM: ContactUsVM, queryparameter : string) {
      
      this.params = new HttpParams({fromString: 'Mensagem=' + queryparameter});
     return this._http.post<any>(`${this.config.apiEndpoint}/ContactUs/SendMessage`,contactUsVM, {params:this.params});
   }
}

