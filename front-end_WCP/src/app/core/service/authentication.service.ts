import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ACCOUNT_URLS, PROJETS_URLS} from './api.url.config';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private router: Router) {}

  authenticate(credentials): Promise<any> {
    return this.httpClient.post(ACCOUNT_URLS.LOGIN_URL, credentials, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  validateToken(): Promise<any> {
    return this.httpClient.get(ACCOUNT_URLS.VALIDATE_TOKEN_URL, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  isUserLoggedIn() {
    const token = localStorage.getItem('token');
    return !(token === null);
  }

  isRoleAuthorized(role: string): boolean {
    if (localStorage.getItem('user')) {
      let roles: Array<string> = JSON.parse(localStorage.getItem('user')).roles;
      return roles.includes(role);
    }
    return false;
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('prj');
    this.router.navigateByUrl('/app/home');

  }

}
