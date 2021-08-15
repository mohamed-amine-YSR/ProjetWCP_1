import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ACCOUNT_URLS, PROJETS_URLS} from './api.url.config';
import {ProjetModel} from '../model/projet.model';
import {CommentaireModel} from '../model/commentaire.model';
import {UserModel} from '../model/user.model';
import {DemandeAccesModel} from '../model/demandeAcces.model';
import {PhaseModel} from '../model/phase.model';
import {TacheModel} from '../model/tache.model';

@Injectable()
export class ProjetService {

  constructor(private http: HttpClient) {
  }

  addProblem(projet: ProjetModel): Promise<any> {
    return this.http.post(PROJETS_URLS.ADD_PROBLEM_URL, projet, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  updateProblem(projet: ProjetModel): Promise<any> {
    return this.http.put(PROJETS_URLS.UPDATE_PROBLEM_URL, projet, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  soumettreProjet(projet: ProjetModel): Promise<any> {
    return this.http.put(PROJETS_URLS.SOUMETTRE_Projet_URL, projet, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  deciderProjet(idPrj: string, dec: boolean): Promise<any> {
    return this.http.get(PROJETS_URLS.Decider_Projet_URL + '/' + idPrj + '/' + dec, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  demanderAcces(projet: ProjetModel): Promise<any> {
    return this.http.put(PROJETS_URLS.DEMANDE_ACCES_URL, projet, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  deciderAcces(dec: boolean, d: DemandeAccesModel): Promise<any> {
    return this.http.put(PROJETS_URLS.DECIDER_ACCES_URL + '/' + dec, d, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  addPhase(id: string, phase: PhaseModel): Promise<any> {
    return this.http.put(PROJETS_URLS.ADD_PHASE_URL + '/' + id, phase, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  savePhase(id: string, type: number, phase: PhaseModel): Promise<any> {
    return this.http.put(PROJETS_URLS.SAVE_PHASE_URL + '/' + id + '/' + type, phase, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  saveTache(idP: string, idPh: string, type: number, tache: TacheModel): Promise<any> {
    return this.http.put(PROJETS_URLS.SAVE_TACHE_URL + '/' + idP + '/' + idPh + '/' + type, tache, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  getProbById(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.PROB_ID_URL + '/' + id);
  }

  getMyPrj(): Observable<any> {
    return this.http.get(PROJETS_URLS.MY_PRJ_URL);
  }

  getAccess(id: string): Promise<any> {
    return this.http.get(PROJETS_URLS.PROJET_GET_ACCESS_URL + '/' + id, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  getInfosProjet(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.PROJET_INFOS_URL + '/' + id);
  }

  getDeroulement(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.GET_DEROULEMENT_URL + '/' + id);
  }

  getPhases(id: string, skip: number, limit: number): Observable<any> {
    return this.http.get(PROJETS_URLS.GET_PHASES_URL + '/' + id + '/' + skip + '/' + limit);

  }

  getAllPhases(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.ALL_PHASES_URL + '/' + id);

  }

  getTaches(idP: string, idPh: string, skip: number, limit: number): Observable<any> {
    return this.http.get(PROJETS_URLS.GET_TACHES_URL + '/' + idP + '/' + idPh + '/' + skip + '/' + limit);

  }

  getAccessPrj(id: string, type: number, skip: number, limit: number): Observable<any> {
    return this.http.get(PROJETS_URLS.PROJET_ACCESS_URL + '/' + id + '/' + type + '/' + skip + '/' + limit);
  }

  getAllProblems(page: number, size: number): Observable<any> {
    return this.http.get(PROJETS_URLS.ALL_PROBS_URL + '?page=' + page + '&size=' + size);
  }

  countAllProbs(): Observable<any> {
    return this.http.get(PROJETS_URLS.COUNT_ALL_PROBS_URL);
  }

  getRecommendedProjets(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.RECOMMENDED_PROJETS_URL + '/' + id);
  }

  getRecommendedUsers(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.RECOMMENDED_USERS_URL + '/' + id);
  }

  addSkills(skills: string[]): Observable<any> {
    return this.http.post(PROJETS_URLS.ADD_SKILLS_URL, skills);
  }

  getSkills(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.GET_SKILLS_URL + '/' + id);
  }

  getAllSkills(): Observable<any> {
    return this.http.get(PROJETS_URLS.ALL_SKILLS_URL);
  }

  addComment(commentaire: CommentaireModel, id: string): Promise<any> {
    return this.http.post(PROJETS_URLS.ADD_COMMENT_URL + '/' + id, commentaire, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  addReact(user: UserModel, id: string, react: boolean): Promise<any> {
    return this.http.post(PROJETS_URLS.ADD_REACT_URL + '/' + id + '/' + react, user, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  demandeAdhesion(user: UserModel, id: string, type: boolean): Promise<any>  {
    return this.http.post(PROJETS_URLS.DEMANDE_ADHESION_URL + '/' + id + '/' + type, user, {responseType: 'text'})
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  getComments(id: string, skip: number, limit: number): Observable<any> {
    return this.http.get(PROJETS_URLS.LIST_COMMENTS_URL + '/' + id + '/' + skip + '/' + limit);
  }

  getReacts(id: string, type: boolean): Observable<any> {
    return this.http.get(PROJETS_URLS.ALL_REACTS_URL + '/' + id + '/' + type);
  }

  getDemandes(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.ALL_DEMANDES_URL + '/' + id);
  }

  getComment(idP: string, idC: string): Observable<any> {
    return this.http.get(PROJETS_URLS.ONE_COMMENT_URL + '/' + idP + '/' + idC);
  }

  getAllPublicProjects(page: number, size: number): Observable<any> {
    return this.http.get(PROJETS_URLS.PROJETS_PUBLIC_URL + '?page=' + page + '&size=' + size);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(PROJETS_URLS.PROJET_ID_URL + '/' + id);
  }

  countPublicProjects(): Observable<any> {
    return this.http.get(PROJETS_URLS.COUNT_PUBLIC_URL);
  }
}
