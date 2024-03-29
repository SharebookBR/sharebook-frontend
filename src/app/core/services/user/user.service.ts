import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';
import { UserInfo } from '../../models/userInfo';
import { ChangePasswordUserVM } from '../../models/ChangePasswordUserVM';
import { AnonymizeUserVM } from '../../models/AnonymizeUserVM';
import { ChangeUserPasswordByHashCodeVM } from '../../models/ChangeUserPasswordByHashCodeVM';
import { ForgotMyPasswordVM } from '../../models/forgotMyPasswordVM';
import { Profile } from '../../models/profile';

import { APP_CONFIG, AppConfig } from '../../../app-config.module';

@Injectable()
export class UserService {
  private _subject = new Subject<any>();

  constructor(private _http: HttpClient, @Inject(APP_CONFIG) private config: AppConfig) {}

  getAll() {
    return this._http.get<User[]>(`${this.config.apiEndpoint}/users`);
  }

  getUserData() {
    return this._http.get<UserInfo>(`${this.config.apiEndpoint}/Account`);
  }

  register(user: User) {
    return this._http.post<any>(`${this.config.apiEndpoint}/Account/Register`, user).pipe(
      map((response) => {
        // login successful if there's a jwt token in the response
        if (response.authenticated) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('shareBookUser', JSON.stringify(response));
          this.setLoggedUser(response);
        }
        return response;
      })
    );
  }

  update(userInfo: UserInfo) {
    return this._http.put<any>(`${this.config.apiEndpoint}/Account`, userInfo);
  }

  changePassword(changePasswordUserVM: ChangePasswordUserVM) {
    return this._http.put<any>(`${this.config.apiEndpoint}/Account/ChangePassword/`, changePasswordUserVM);
  }

  resetPassword(forgotMyPasswordVM: ForgotMyPasswordVM) {
    return this._http.post<any>(`${this.config.apiEndpoint}/Account/ForgotMyPassword/`, forgotMyPasswordVM);
  }

  changeUserPasswordByHashCode(changeUserPasswordByHashCodeVM: ChangeUserPasswordByHashCodeVM) {
    return this._http.put<any>(
      `${this.config.apiEndpoint}/Account/ChangeUserPasswordByHashCode/`,
      changeUserPasswordByHashCodeVM
    );
  }

  parentAproval(hashCode: string) {
    return this._http.put<any>(`${this.config.apiEndpoint}/Account/ParentAproval/`, {
      ParentHashCodeAproval: hashCode,
    });
  }

  delete(id: number) {
    // return this._http.delete(`${this.config.apiEndpoint}/users/` + id);
  }

  setLoggedUser(user: User) {
    this._subject.next(user);
  }

  getLoggedUser(): Observable<any> {
    return this._subject.asObservable();
  }

  getLoggedUserFromLocalStorage() {
    if (localStorage.getItem('shareBookUser')) {
      return JSON.parse(localStorage.getItem('shareBookUser'));
    }
    return;
  }

  getProfile() {
    return this._http.get<Profile>(`${this.config.apiEndpoint}/account/profile`);
  }

  getAllFacilitators(userIdDonator: string) {
    return this._http.get<User[]>(`${this.config.apiEndpoint}/Account/ListFacilitators/` + userIdDonator);
  }

  downloadData() {
    return this._http.get<UserInfo>(`${this.config.apiEndpoint}/Account`);
  }

  whoAccessed() {
    return this._http.get<any>(
      `${this.config.apiEndpoint}/Account/WhoAccessed/${JSON.parse(localStorage.shareBookUser).userId}`
    );
  }

  anonymize(dto: AnonymizeUserVM) {
    return this._http.post<any>(`${this.config.apiEndpoint}/Account/Anonymize`, dto);
  }
}
