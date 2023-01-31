import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserI } from '../models/user-i';
import { UrlConstants } from '../models/url-constants';
import { Observable } from 'rxjs/Observable';
import { UserRoles } from '../models/user-roles';
import { UtilsService } from './utils.service';

@Injectable()
export class UserService {
  private urlConstants: UrlConstants;
  private loggedIn = false;
  private router: Router;
  public user: UserI;

  private jsonHeader = new HttpHeaders().set('Content-Type', 'application/json');
  private jsonHeaderWithToken: HttpHeaders;

  private token: string;
  constructor(private http: HttpClient, private utilsService: UtilsService) {
    this.urlConstants = new UrlConstants();
  }

  isUserAuthenticated(): boolean {
    return this.loggedIn;
  }

  setUserAuthenticated(isLoggedIn: boolean) {
    this.utilsService.setAuthenticationToken(this.user.token);
    this.loggedIn = isLoggedIn;
  }

  logout(): void {
    this.loggedIn = false;
  }

  setUser(loggedInUser: UserI) {
    this.user = loggedInUser;
  }

  login(user: UserI): Observable<UserI> {
    const body = JSON.stringify(user);
    return this.http
      .post<UserI>(UrlConstants.userLogin, body, {
        headers: this.jsonHeader
      });
  }

  getUsers(pageNo: number, pageSize: number): Observable<UserI[]> {
    const paramsX = new HttpParams().set('token', this.user.token).set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http
      .get<UserI[]>(UrlConstants.getUsers, {
        headers: this.jsonHeader,
        params: paramsX
      });
  }

  updateUser(user: UserI): Observable<Object> {
    const paramsX = new HttpParams().set('token', this.user.token);
    const body = JSON.stringify(user);
    console.log(body);
    return this.http
      .put<Object>(UrlConstants.updateUser, body, {
        headers: this.jsonHeader,
        params: paramsX
      });
  }

  deleteUser(userId: number): Observable<Object> {
    const paramsX = new HttpParams().set('token', this.user.token).set('id', userId.toString());
    return this.http
      .delete(UrlConstants.deleteUser, {
        headers: this.jsonHeader,
        params: paramsX
      });
  }

  register(user: UserI): Observable<Object> {
    const body = JSON.stringify(user);
    const paramsX = new HttpParams().set('token', this.user.token);
    // console.log(body);
    return this.http
      .post(UrlConstants.userRegister, body, {
        headers: this.jsonHeader,
        params: paramsX
      });
  }

  getUserId(): number {
    return this.user.id;
  }

  getUserName(): string {
    return this.user.username;
  }

  getUserRole(): string {
    return this.user.userRole;
  }

}
