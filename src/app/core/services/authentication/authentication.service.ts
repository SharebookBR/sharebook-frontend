import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserService } from '../user/user.service';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient,
      private router: Router,
      private _user: UserService,
      @Inject(APP_CONFIG) private config: AppConfig) { }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.config.apiEndpoint}/Account/Login/`, { email: email, password: password })
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                if (response.success || response.value.authenticated) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('shareBookUser', JSON.stringify(response.value));
                    this._user.setLoggedUser(response.value);
                }

                return response.value;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('shareBookUser');
        this._user.setLoggedUser(null);
    }
}
