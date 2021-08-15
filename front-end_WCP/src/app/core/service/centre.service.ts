import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CENTRES_URLS, PROJETS_URLS} from './api.url.config';
import {CentreModel} from '../model/centre.model';
import {Observable} from 'rxjs';

@Injectable()
export class CentreService {
  constructor(private http: HttpClient) {}

  saveCentre(centre: CentreModel): Promise<any> {
    return this.http.post(CENTRES_URLS.ADD_CENTRE_URL, centre, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  updateCentre(centre: CentreModel): Promise<any> {
    return this.http.put(CENTRES_URLS.UPDATE_CENTRE_URL, centre, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  getCentreById(idC: string): Observable<any> {
    return this.http.get(CENTRES_URLS.GET_CENTRE_ID_URL + '/' + idC);
  }

  countAllCentres(): Observable<any> {
    return this.http.get(CENTRES_URLS.COUNT_CENTRES_URL);
  }

  getAllCentres(page: number, size: number): Observable<any> {
    return this.http.get(CENTRES_URLS.GET_CENTRES_URL + '?page=' + page + '&size=' + size);
  }
}
