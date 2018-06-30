import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../../models/user';
import { Profile } from '../../models/profile';

const API_URL = 'http://localhost:3000/api';

@Injectable()
export class UserService {
    constructor(private _http: HttpClient) { }

    register(user: User) {
        return this._http.post<User>(`${API_URL}/Account/Register`, user);
    }

    login(user: User) {
        return this._http.post<User>(`${API_URL}/Account/Login/`, user);
    }

    public getProfile() {
        return [
          new Profile(1, 'USER'),
          new Profile(2, 'ADMIN'),
        ];
        // return this._http.get<Profile[]>(`${API_URL}/Account/Profile`);
      }    

}