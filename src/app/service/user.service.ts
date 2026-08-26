
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';
import { User } from '@models/User';
import { UserLogin } from '@models/UserLogin';
import { ChangePassword } from '@models/ChangePassword';
import { ResetPassword } from '@models/ResetPassword';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private requestUrl = '';
  private apiStatus?: ApiStatus;

  constructor(private http: HttpClient) { }

  userLogin(userLogin: UserLogin): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/login';
    return this.http.post<ApiStatus>(this.requestUrl, userLogin, { withCredentials: true });
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

  changeUserPassword(changePassword: ChangePassword): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/change-password';
    return this.http.patch<ApiStatus>(this.requestUrl, changePassword, { withCredentials: true });
  }

  resetUserPassword(resetPassword: ResetPassword): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'user/reset-password';
    return this.http.patch<ApiStatus>(this.requestUrl, resetPassword, { withCredentials: true });
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
