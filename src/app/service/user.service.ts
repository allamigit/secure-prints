
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private requestUrl = '';
  private apiStatus?: ApiStatus;

  constructor(private http: HttpClient) { }

  userLogin(userName: string, userPassword: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/login?userName=' + userName + '&userPassword=' + userPassword;
    return this.http.post<ApiStatus>(this.requestUrl, {}, { withCredentials: true });
  }

  userLogout(): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/logout';
    return this.http.post<ApiStatus>(this.requestUrl, {}, { withCredentials: true });
  }

  isUserLoggedIn(): Observable<boolean> {
    this.requestUrl = environment.apiUrl + 'user/logged-in';
    return this.http.get<boolean>(this.requestUrl, { withCredentials: true });
  }

  changeUserPassword(oldPassword: string, newPassword: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/change-password?oldPassword=' + oldPassword + '&newPassword=' + newPassword;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }

}
