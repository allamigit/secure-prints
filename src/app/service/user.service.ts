
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';
import { ApiResponse } from '@models/ApiResponse';
import { User } from '@models/User';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private requestUrl = '';
  private apiStatus?: ApiStatus;

  constructor(private http: HttpClient) { }

  userLogin(userName: string, userPassword: string): Observable<ApiResponse> {
    this.requestUrl = environment.apiUrl + 'user/login?userName=' + userName + '&userPassword=' + userPassword;
    return this.http.post<ApiResponse>(this.requestUrl, {}, { withCredentials: true });
  }

  userLogout(): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/logout';
    return this.http.post<ApiStatus>(this.requestUrl, {}, { withCredentials: true });
  }

  isUserLoggedIn(): Observable<boolean> {
    this.requestUrl = environment.apiUrl + 'user/logged-in';
    return this.http.get<boolean>(this.requestUrl, { withCredentials: true });
  }

  addUser(user: User): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/add-user';
    return this.http.post<ApiStatus>(this.requestUrl, user, { withCredentials: true });  
  }

  changeUserPassword(oldPassword: string, newPassword: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/change-password?oldPassword=' + oldPassword + '&newPassword=' + newPassword;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }

  resetUserPassword(userName: string, newPassword: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/reset-password?userName=' + userName + '&newPassword=' + newPassword;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }

  updateUserDetails(user: User): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/update-user';
    return this.http.put<ApiStatus>(this.requestUrl, user, { withCredentials: true });
  }

  getAllUsers(): Observable<User[]> {
    this.requestUrl = environment.apiUrl + 'user/all-users';
    return this.http.get<User[]>(this.requestUrl, { withCredentials: true });
  }

  getUserDetails(userName: string): Observable<User> {
    this.requestUrl = environment.apiUrl + 'user/user?userName=' + userName;
    return this.http.get<User>(this.requestUrl, { withCredentials: true });
  }

}
