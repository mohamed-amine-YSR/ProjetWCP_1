import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ACCOUNT_URLS, CENTRES_URLS} from './api.url.config';
import {CentreModel} from '../model/centre.model';
import {UserModel} from '../model/user.model';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(ACCOUNT_URLS.USER_EMAIL_URL + '/' + email);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(ACCOUNT_URLS.USER_ID_URL + '/' + id);
  }

  getUserLike(str: string): Observable<any> {
    return this.http.get(ACCOUNT_URLS.USER_LIKE_URL + '/' + str);
  }

  getUserLikeAndInCentre(str: string, idCentre: string, idResp: string): Observable<any> {
    return this.http.get(ACCOUNT_URLS.USER_LIKE_CENTRE_URL + '/' + str + '?idCentre=' + idCentre + '&idResp=' + idResp);
  }

  getUsersInCentre(idCentre: string, idResp: string, page: number, size: number): Observable<any> {
    return this.http.get(ACCOUNT_URLS.USERS_IN_CENTRE_URL + '/' + idCentre + '?idResp=' + idResp + '&page=' + page + '&size=' + size);
  }

  getUsersByDemande(demande: number, page: number, size: number): Observable<any> {
    return this.http.get(ACCOUNT_URLS.USERS_BY_DEMANDE + '/' + demande + '?page=' + page + '&size=' + size);
  }

  countUsersInCentre(idCentre: string, idResp: string): Observable<any> {
    return this.http.get(ACCOUNT_URLS.COUNT_USERS_CENTRE_URL + '/' + idCentre + '?idResp=' + idResp);
  }

  countUsersByDemande(demande: number): Observable<any> {
    return this.http.get(ACCOUNT_URLS.COUNT_USERS_BY_DEMANDE + '/' + demande);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(ACCOUNT_URLS.ALL_USER_URL);
  }

  filterUsersInCentre(key: string, etat: boolean, centre: string): Observable<any> {
    return this.http.get(ACCOUNT_URLS.FILTER_USERS_IN_CENTRE_URL + '?key=' + key + '&etat=' + etat + '&centre=' + centre);
  }

  addMembresCentre(membres: Array<UserModel>): Promise<any> {
    return this.http.post(ACCOUNT_URLS.ADD_USERS_CENTRE_URL, membres, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  addMembreInsc(membre: UserModel): Promise<any> {
    return this.http.post(ACCOUNT_URLS.ADD_USER_INSC, membre, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  setEtat(etat: boolean, idUser: string): Promise<any> {
    return this.http.get(ACCOUNT_URLS.USER_SET_ETAT_URL + '?etat=' + etat + '&idUser=' + idUser, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  setEtatDemande(etat: boolean, idUser: string): Promise<any> {
    return this.http.get(ACCOUNT_URLS.USER_SET_ETAT_DEMANDE_URL + '?etat=' + etat + '&idUser=' + idUser, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  reInitPassword(idUser: string): Promise<any> {
    return this.http.get(ACCOUNT_URLS.USER_REINIT_PASSWORD_URL + '?idUser=' + idUser, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

}
