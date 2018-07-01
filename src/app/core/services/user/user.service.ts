import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { User } from '../../models/user';
import { Profile } from '../../models/profile';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';

@Injectable()
export class UserService {

    private _subject = new Subject<any>();

    constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) { }

    getAll() {
        return this._http.get<User[]>(`${this.config.apiEndpoint}/users`);
    }

    getById(id: number) {
        return this._http.get(`${this.config.apiEndpoint}/users/` + id);
    }

    register(user: User) {
        return this._http.post(`${this.config.apiEndpoint}/Account/Register`, user);
    }

    update(user: User) {
        return this._http.put(`${this.config.apiEndpoint}/users/` + user.id, user);
    }

    delete(id: number) {
        return this._http.delete(`${this.config.apiEndpoint}/users/` + id);
    }

    setLoggedUser(user: User) {
        this._subject.next(user);
    }

    getLoggedUser(): Observable<any> {
        return this._subject.asObservable();
    }

    public getProfile() {
        return [
            new Profile(1, 'USER'),
            new Profile(2, 'ADMIN'),
        ];
        // return this._http.get<Profile[]>(`${API_URL}/Account/Profile`);
    }

}
