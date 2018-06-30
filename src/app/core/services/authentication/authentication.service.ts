import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

import { UserService } from '../user/user.service';

const API_URL = 'http://localhost:3000/api';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient, private router: Router, private _user: UserService) { }

    login(email: string, password: string) {
        return this.http.post<any>(`${API_URL}/Account/Login/`, { email: email, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('shareBookUser', JSON.stringify(user));
                    this._user.setLoggedUser(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('shareBookUser');
        this._user.setLoggedUser(null);
    }
}