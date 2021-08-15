import {Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from '../../../core/service/authentication.service';
import {ProjetModel} from '../../../core/model/projet.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjetService} from '../../../core/service/projet.service';
import {CommentaireModel} from '../../../core/model/commentaire.model';
import {UserModel} from '../../../core/model/user.model';
import {UserService} from '../../../core/service/user.service';
import {SkillModel} from '../../../core/model/skill.model';
import {DemandeAccesModel} from '../../../core/model/demandeAcces.model';
import {FormControl} from '@angular/forms';
import {PhaseModel} from '../../../core/model/phase.model';
import {TacheModel} from '../../../core/model/tache.model';
import {TacheEvent} from './tacheEvent';

import {startOfDay, isSameDay, isSameMonth} from 'date-fns';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {Subject} from 'rxjs';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ModalDirective} from 'ngx-bootstrap';
import {WsConfig} from '../../../core/service/ws.config';

declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit, OnDestroy {
   @ViewChild('addPhaseModal') addPhaseModal: ModalDirective;
   @ViewChild('saveTache') saveTache: ModalDirective;
   @ViewChild('livrable') livrable: ModalDirective;
   @ViewChild('updatePhaseModal') updatePhaseModal: ModalDirective;
   @ViewChild('tacheCal') tacheCal: ModalDirective;
  /*content: string = '<h4>À la guerre, comme à la guerre</h4>' +
    '<p>' +
      'L’expression ” Transformation Digitale” fait, justement, référence à l\'utilisation de la technologie afin d’améliorer les performances ou la portée des entreprises.' +
      ' Les technologies de l’information et du Digital, sont devenues, en à peine 50 ans, le principal défi posé aux dirigeants mondiaux et à leurs organisations.' +
      ' La question n’est plus aujourd’hui de savoir s’il faut prendre la vague digitale mais comment la prendre et dans quelle direction.' +
    '</p>' +
    '<h4>Changer d\'Ère</h4>' +
    '<p>' +
      'Lors de l’arrêt industriel et économique que la pandémie a imposé, partout dans le monde, les organisations qui ont pu maintenir leur métier de façon quasi inchangée' +
      ' sont celles qui avaient réussi au préalable à transformer leur relation avec leurs clients/citoyens, avec leurs fournisseurs, ainsi que leur relation avec leurs ' +
      'collaborateurs grâce à l’appui des nouvelles technologies du Digital. Leur emboitant le pas, beaucoup d’autres ont tenté de faire cette mutation, à chaud, pendant ' +
      'la crise en espérant réussir la métamorphose digitale afin de bénéficier elles aussi des bienfaits de la digitalisation.' +
    '</p>' +
    '<h4>Leçons de survie</h4>' +
    '<p>' +
      'L’accronyme VUCA a été introduit par le US Army War College dans les années 90 pour décrire le monde après l’effondrement de l’Union soviétique. Il décrit un monde ' +
      'multilatéral plus volatile, incertain, complexe et ambigu, résultat de la fin de la guerre froide. La transformation digitale est aussi la réponse à un mode économique VUCA,' +
      ' elle est désormais une question de survie. Afin de préparer le Maroc à anticiper des épisodes de crises similaires à celle du COVID-19, nous proposons trois chantiers essentiels' +
      ' à notre regard dans la période à venir :' +
      '<ul>' +
        '<li>Un écosystème fertile et vivace</li>' +
        '<li>Un plan d’urgence</li>' +
        '<li>Une souveraineté numérique</li>' +
      '</ul>' +
    '</p>';*/


  view: CalendarView = CalendarView.Month;

  // CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  events: TacheEvent[] = [];
   /* {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];*/

  colors: any = {
    red: {
      primary: '#ad2121', secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff', secondary: '#D1E8FF',
    },
    green: {
      primary: '#37bc9b', secondary: '#bbf6d5',
    },
    yellow: {
      primary: '#e3bc08', secondary: '#FDF1BA',
    },
  };

  access: boolean = false;

  usersC: UserModel[] = [];
  usersM: UserModel[] = [];
  selectedMembres: UserModel[] = [];
  res: string = 'Veuillez saisir un mot clé';
  contents: string;
  public id: string;
  public type: string;
  public idUser: string;
  public mailUser: string;
  public problem: ProjetModel;
  public problemModif: ProjetModel;
  public commentaire: CommentaireModel = new CommentaireModel();

  checked: string = 'pub';

  not_found: boolean = false;
  soum_not_authorized: boolean = false;
  soum_not_allowed: boolean = false;
  en_cours: boolean = false;
  en_cours_a: boolean = false;
  en_cours_all: boolean = false;
  en_cours_req: boolean = false;
  en_cours_c: boolean = false;
  en_cours_i: boolean = false;
  en_cours_r: boolean = false;
  en_cours_rt: boolean = false;
  en_cours_rp: boolean = false;
  en_cours_lv: boolean = false;
  en_cours_mod: boolean = false;
  en_cours_s: boolean = false;
  showMore: boolean = true;
  is_error: boolean = false;
  details: boolean = false;
  hide_details: boolean = false;
  details_d: boolean = false;
  hide_details_d: boolean = false;
  modif: boolean = false;

  dis: boolean = false;

  current_count_comments: number = 0;
  all_comments: number = 0;

  react_type: number = 2;
  demande_type: number = 0;

  comments: Array<CommentaireModel> = new Array<CommentaireModel>();
  likers: UserModel[];
  dislikers: UserModel[];
  demandes: UserModel[];
  skills: SkillModel[];

  skl1: Array<string>;
  skl2: Array<string>;
  errors: Array<string>;
  Allskills = new Array<SkillModel>();

  config = {
    lang: 'fr-FR',
    contents: 'cosmo',
    toolbar: [
      ['font', ['bold', 'underline']],
      ['fontname', ['fontname']],
      ['color', ['color']],
      ['para', ['ul', 'ol']],
      ['insert', ['link', 'hr']],
      ['view', [ 'undo', 'redo']],
    ],
    height: 200,
    placeholder: 'Ajoutez ici votre commentaire , vous pouvez aussi mettre les liens des fichiers '
  };

  config0 = {
    lang: 'fr-FR',
    contents: 'cosmo',
    toolbar: [
      ['font', ['bold', 'underline']],
      ['fontname', ['fontname']],
      ['color', ['color']],
      ['para', ['ul', 'ol']],
      ['insert', ['link', 'hr']],
      ['view', [ 'undo', 'redo']],
    ],
    height: 200,
    placeholder: 'Ajoutez ici les URLs où vous avez mis votre livrable pour cette action. vous pouvez aussi ajouter des commentaires ...'
  };

  config1 = {
    lang: 'fr-FR',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['fontname', ['fontname']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video', 'hr']],
      ['view', ['fullscreen', 'undo', 'redo']],
    ],
    height: 300,
    placeholder: 'Décrivez ici votre idée de départ, vous pouvez aussi mettre des liens vers des sites web ou bien vers des fichiers'
  };

  config2 = {
    lang: 'fr-FR',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['fontname', ['fontname']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video', 'hr']],
      ['view', ['fullscreen', 'undo', 'redo']],
    ],
    height: 150,
    placeholder: 'Décrivez ici cette phase, vous pouvez aussi mettre des liens vers des sites web ou bien vers des fichiers'
  };

  bsConfig = {
    containerClass: 'theme-angle'
  };
  bsValue = new Date();

  ancien_val_chef: string = '';
  ancien_val_membres: string = '';

  recommandationsUsers: UserModel[] = [];
  demandesAccepted: UserModel[] = [];
  recommandationsUsersAccepted: UserModel[] = [];

  recommandationsProjets: ProjetModel[] = [];
  recommandationsProjetsAccepted: ProjetModel[] = [];

  idChef: string = '';
  invitedUsers: Array<string> = [];

  public validators = [this.must_be_email];
  public errorMessages = {
    'must_be_email' : 'Vous devez saisir un email correct !'
  };

  skip: number;
  current_prj_access: number = 0;
  current_prj_access_all: number = 0;
  current_prj_access_req: number = 0;
  prjAccess: Array<DemandeAccesModel> = [];
  prjAccessAll: Array<DemandeAccesModel> = [];
  prjAccessRequested: Array<DemandeAccesModel> = [];
  role: string = 'non membre du projet';

  membres: Array<UserModel> = [];
  phases: Array<PhaseModel> = [];
  count_phases: number = 0;
  current_count_phases: number = 0;
  current_count_taches: number = 0;
  selectedPhase: PhaseModel = null;
  selectedTache: TacheModel;
  type_save: number;
  newPhase: PhaseModel;
  updatedPhase: PhaseModel;
  update: boolean = true;
  ao: boolean = false;
  modifLivrable: boolean = false;
  strLivrable: string;

  allPhases: Array<PhaseModel> = [];
  idPhase: string = '';

  constructor(public route: ActivatedRoute, private router: Router, public authenticationService: AuthenticationService, private projetService: ProjetService,
              private userService: UserService, private wsConfig: WsConfig) {
    this.route.params.subscribe(
      params => {this.id = params['id'];
                      this.type = params['type'];
        // n9dr nziid switch o default nredirigiha l "pub"
        if (this.type === 'pub') this.init();
        else if (this.type === 'soumission') this.initSoumission();
        else if (this.type === 'info') {this.initInfo();this.en_cours_all = false;this.en_cours_c=false;}
        else if (this.type === 'planification') this.initDeroulement();
        else if (this.type === 'cal') this.initCal();
        else this.router.navigateByUrl('/collaboration/' + this.id + '/pub');
      }
    );
  }

  ngOnInit() {
    this.access = false;
    this.socketConnect();
    if (this.authenticationService.isUserLoggedIn()) {
      this.getAccess();
      this.idUser = JSON.parse(localStorage.getItem('user')).idU;
      this.mailUser = JSON.parse(localStorage.getItem('user')).email;
    }
  }

  ngOnDestroy() {
    this.wsConfig.ws_details = false;
    if (!this.authenticationService.isUserLoggedIn()) {
      this.wsConfig.closeSocket();
    }
  }

  getAllPhases() {
    this.projetService.getAllPhases(this.id).subscribe(
      data => this.allPhases = data,
      error => console.log('an error was occured !'),
      () => this.initPhaseCal()
    );
  }

  selectPhase(value: any) {
    if (this.allPhases.filter(ph => ph.idPhase === value).length > 0) {
      this.events = [];
      this.current_count_taches = 0;
      this.selectedPhase = this.allPhases.filter(ph => ph.idPhase === value)[0];
      this.selectedPhase.taches = new Array<TacheModel>();
      this.getTaches(this.skip);
    }
  }

  initPhaseCal() {
    if (this.allPhases.length > 0) {
      this.selectedPhase = this.allPhases[this.allPhases.length - 1];
      this.idPhase = this.selectedPhase.idPhase;
      this.events = [];
      this.current_count_taches = 0;
      this.selectedPhase.taches = new Array<TacheModel>();
      this.getTaches(this.skip);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.selectedTache = this.selectedPhase.taches.filter(t => t.ref === event.id)[0];
    this.tacheCal.show();
  }

  /*eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event);
  }*/

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  redirectDate(date: Date) {
    this.viewDate = new Date(date);
    this.refresh.next();
  }


  private must_be_email(control: FormControl) {
    var email_regex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value !== '' && (control.value.length <= 5 || !email_regex.test(control.value))) {
      return { 'must_be_email': true };
    }
    return null;
  }

  open($event) {
    this.ao = $event;
  }

  init() {

    this.modif = false;
    this.getProblemtById();
    this.commentaire.comment = '';
  }

  // nzid le3ba dial qlq non autorisé bach ychouf les infos dial lprojet b data
  initInfo() {
    this.skip = 5;
    this.current_prj_access = 0;
    this.current_prj_access_all = 0;
    this.current_prj_access_req = 0;
    this.en_cours_i = true;
    this.en_cours_r = false;
    this.en_cours_c = false;
    this.en_cours_mod = false;
    this.en_cours_all = false;
    this.en_cours_req = false;
    this.not_found = false;
    this.problem = undefined;
    this.prjAccess = [];
    this.prjAccessAll = [];
    this.prjAccessRequested = [];
    this.recommandationsProjets = [];
    this.recommandationsProjetsAccepted = [];
    this.projetService.getInfosProjet(this.id).subscribe(
      data => {this.problem = data; console.log(this.problem)},
      error => { console.log('An error was occured.');
        this.is_error = true;
        this.en_cours_i = false;
        },
      () => {
        console.log('Loading informations was done!');
        // console.log(this.problem);
        this.en_cours_i = false;
        if (this.problem == null) {this.not_found = true; }
        else {
          if (this.problem.countAccessPrj > 0) this.getPrjAccess(this.skip, 1);
          if (this.problem.chef.idU === this.idUser) {
            this.getRecommendedProjets();
            if (this.problem.countAccessPrjAll > 0) this.getPrjAccess(this.skip, 2);
            if (this.problem.countRequestPrjAll > 0) this.getPrjAccess(this.skip, 3);
          }
        }
      }
    );
    this.role = 'non membre';
  }

  initDeroulement() {
    this.en_cours_i = true;
    this.en_cours_r = false;
    this.en_cours_rt = false;
    this.en_cours_rp = false;
    this.en_cours_lv = false;
    this.modifLivrable = false;
    this.skip = 7;
    this.membres = [];
    this.phases = [];
    this.problem = new ProjetModel();
    this.current_count_phases = 0;
    this.current_count_taches = 0;
    this.newPhase = new PhaseModel();
    this.updatedPhase = new PhaseModel();
    this.newPhase.taches = [];
    this.selectedPhase = null;
    this.selectedTache = new TacheModel();
    this.type_save = 0;

    this.projetService.getDeroulement(this.id).subscribe(
      data => {this.problem = data; },
      error => {console.log('an error was occured !'); this.is_error = true; this.en_cours_i = false; },
      () => {
        if (this.problem == null) {this.not_found = true; }
        else {
          if (this.problem.countPhases > 0) {
            this.getPhases(this.skip);
          }
        }
        this.en_cours_i = false;
      }
    );
  }

  initCal() {
    this.skip = 5;
    this.events = [];
    this.allPhases = [];
    this.current_count_taches = 0;
    this.selectedTache = null;
    this.idPhase = '';
    registerLocaleData(localeFr);
    this.getAllPhases();
    // this.calendarOptions.events = this.calendarEvents;
  }

  clickSaveTache(t: TacheModel, type: number) {
    this.type_save = type;
    if (this.type_save === 0) {
      this.selectedTache = t;
      this.selectedTache.dateLimite = new Date(this.selectedTache.dateLimite);
    }
    if (this.type_save === 1) {
      this.selectedTache = new TacheModel();
    }
    if (this.type_save === 2) {
      this.selectedTache = t;
      this.removeTache();
    }
    if (this.type_save === 3 || this.type_save === 4) {
      this.strLivrable = '';
      this.modifLivrable = false;
      this.selectedTache = t;
      if (this.type_save === 3) this.modifLivrable = true;
      this.livrable.show();
    }
  }

  getPhases(skip: number) {
    this.en_cours_c = true;
    const limit = (this.problem.countPhases - this.current_count_phases) < this.skip ? this.problem.countPhases % this.skip : this.skip;
    if (limit > 0) {
      let phs: Array<PhaseModel> = [];
      this.projetService.getPhases(this.id, skip, limit).subscribe(
        data => {phs = data; },
        error => {console.log('an error was occured !'); this.en_cours_c = false; },
        () => {
          if (skip === this.skip && this.selectedPhase === null) {
            this.selectedPhase = phs[0];
            this.selectedPhase.taches = [];
            this.current_count_taches = 0;
            this.getTaches(this.skip);
          }
          for (let ph of phs) {
            this.phases.push(ph);
          }
          this.current_count_phases += phs.length;
          this.en_cours_c = false;
        }
      );
    }
  }

  getTaches(skip: number) {
    if (this.selectedPhase.countTaches > 0) {
      this.en_cours_all = true;
      const limit = (this.selectedPhase.countTaches - this.current_count_taches) < this.skip ? this.selectedPhase.countTaches % this.skip : this.skip;
      if (limit > 0) {
        let tts: Array<TacheModel> = [];
        this.projetService.getTaches(this.id, this.selectedPhase.idPhase, skip, limit).subscribe(
          data => {tts = data; },
          error => {console.log('an error was occured !'); this.en_cours_all = false; },
          () => {
            for (let t of tts) {
              this.selectedPhase.taches.push(t);
              if (this.type === 'cal') {
                this.events.push({
                  start: startOfDay(this.getEndDateCal(t.dateRemise, t.dateLimite)),
                  title: t.title,
                  color: this.getColorDate(t.dateRemise, t.dateLimite, t.livrable),
                  id: t.ref
                });
              }
            }

            if (this.type === 'cal') {
              this.refresh.next();
            }
            this.current_count_taches += tts.length;
            this.en_cours_all = false;
            if (this.type === 'cal' && this.current_count_taches < this.selectedPhase.countTaches) {
              this.getTaches(this.current_count_taches + this.skip);
            }
          }
        );
      }
    }
  }

  getEndDateCal(dateR: Date, dateL: Date) {
    const date0: Date = new Date(dateR);
    const date1: Date = new Date(dateL);
    return (dateR && date0 < date1) ? date0 : date1;
  }

  getColorDate(dateR: Date, dateL: Date, livrable: string) {
    const date0: Date = new Date(dateR);
    const date1: Date = new Date(dateL);
    const date2: Date = new Date();
    const result = (date1.getTime() - date2.getTime()) / 36e5;
    if (livrable) {
      if (date0 < date1) {
        return this.colors.green;
      }
      else {
        return this.colors.red;
      }
    }
    else {
      if (result < 24 && result > 0) {
        return this.colors.yellow;
      }
      else if (result < 0) {
        return this.colors.red;
      }
      else if (result > 24) {
        return this.colors.blue;
      }
    }
  }

  getDefSelectedTache() {
    const date0: Date = new Date(this.selectedTache.dateRemise);
    const date1: Date = new Date(this.selectedTache.dateLimite);
    const livrable = this.selectedTache.livrable;
    const date2: Date = new Date();
    let results: Array<string> = [];
    const result = (date1.getTime() - date2.getTime()) / 36e5;
    if (livrable) {
      if (date0 < date1) {
        results[0] = 'bg-green';
        results[1] = 'Cette action est remise avant la date limite';
      }
      else {
        results[0] = 'bg-danger';
        results[1] = 'Cette action est remise en retard';
      }
    }
    else {
      if (result < 24 && result > 0) {
        results[0] = 'bg-warning';
        results[1] = 'Il reste moins que 24H pour livrer cette action';
      }
      else if (result < 0) {
        results[0] = 'bg-danger';
        results[1] = 'La date limite pour livrer cette action est dépassée';
      }
      else if (result > 24) {
        results[0] = 'bg-primary';
        results[1] = 'Il reste encore du temps pour livrer cette action (+24H)';
      }
    }
    return results;
  }

  getDiffDate(dateL: Date, dateR: Date, livrable: string): Array<string> {
    const date0: Date = new Date(dateR);
    const date1: Date = new Date(dateL);
    const date2: Date = new Date();
    const result = (date1.getTime() - date2.getTime()) / 36e5;
    let res: Array<string> = [];
    if (livrable) {
      if (date0 < date1) {
        res[0] = 'badge bg-green';
        res[1] = 'Livrable remis avant la date limite';
      }
      else {
        res[0] = 'badge bg-danger';
        res[1] = 'Livrable remis en retard';
      }
    }
    else {
      if (result < 24 && result > 0) {
        res[0] = 'badge bg-warning';
        res[1] = 'Il reste moins de 24 heures pour ajouter le livrable';
      }
      else if (result < 0) {
        res[0] = 'badge bg-danger';
        res[1] = 'La date limite pour l\'ajout du livrable est dépassée';
      }
    }
    return res;
  }

  RemisEnRetard() {
    const date1: Date = new Date(this.selectedTache.dateRemise);
    const date2: Date = new Date(this.selectedTache.dateLimite);
    return date1 > date2;
  }

  addNewTache() {
    this.en_cours_r = true;
    this.selectedTache.dateLimite.setHours(23, 59, 59);
    this.projetService.saveTache(this.id, this.selectedPhase.idPhase, 1, this.selectedTache).then(
      data => {
        if (data === 'added') {
          swal('', 'La tache est bien ajoutée !', 'success');
          this.saveTache.hide();
          this.en_cours_r = false;
        }
      },
      error => {console.log('an error was occured !'); this.en_cours_r = false; swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');}
    );
  }

  updateTache() {
    this.en_cours_r = true;
    this.selectedTache.dateLimite.setHours(23,59,59);
    this.projetService.saveTache(this.id, this.selectedPhase.idPhase, 0, this.selectedTache).then(
      data => {
        if (data === 'updated') {
          swal('', 'La tache est bien modifiée !', 'success');
          this.saveTache.hide();
          this.en_cours_r = false;
        }
      },
      error => {console.log('an error was occured !'); this.en_cours_r = false; swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');}
    );
  }

  removeTache() {
    swal({
      title: 'Voulez-vous vraiment supprimer cette action ?',
      text: '',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: '',
          closeModal: true
        },
        confirm: {
          text: 'Confirmer',
          value: true,
          visible: true,
          className: 'bg-primary',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.en_cours_rt = true;

        this.projetService.saveTache(this.id, this.selectedPhase.idPhase, 2, this.selectedTache).then(
          data => {
            this.en_cours_rt = false;
            if (data === 'removed') {
              swal('', 'La tache est bien supprimée  !', 'success');
            }
          },
          error => {console.log('an error cas occured!');
            this.en_cours_rt = false;
            swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
          }
        );
      }
    });
  }

  saveLivrable() {
    this.en_cours_lv = true;
    this.livrable.hide();
    this.selectedTache.livrable = this.strLivrable;
    this.projetService.saveTache(this.id, this.selectedPhase.idPhase, this.type_save, this.selectedTache).then(
      data => {
        if (data === 'added') {
          swal('', 'Votre livrable est bien ajouté !', 'success');
          this.en_cours_lv = false;
          this.modifLivrable = false;
        }
        if (data === 'updated') {
          swal('', 'Votre livrable est bien modifié !', 'success');
          this.en_cours_lv = false;
          this.modifLivrable = false;
        }
      },
      error => {
        console.log('an error was occured !');
        this.en_cours_lv = false;
        this.modifLivrable = false;
        swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
      }
    );
  }

  addTache() {
    this.newPhase.taches = [...this.newPhase.taches, new TacheModel()];
  }

  deleteTache(t: TacheModel) {
    this.newPhase.taches = this.newPhase.taches.filter((tt) => tt !== t);
  }

  addPhase() {
    // console.log(this.newPhase);
    swal({
      title: 'Voulez-vous vraiment ajouter cette phase ?',
      text: '',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: '',
          closeModal: true
        },
        confirm: {
          text: 'Confirmer',
          value: true,
          visible: true,
          className: 'bg-primary',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.en_cours_r = true;

        for (let t of this.newPhase.taches) {
          t.dateLimite.setHours(23, 59, 59);
        }

        this.projetService.addPhase(this.id, this.newPhase).then(
          data => {
            this.en_cours_r = false;
            if (data === 'added') {
              swal('', 'La phase est bien ajoutée au déroulement du projet !', 'success');
              this.addPhaseModal.hide();
              this.newPhase = new PhaseModel();
              this.newPhase.taches = [];
            }
          },
          error => {console.log('an error cas occured!');
            this.en_cours_r = false;
            swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
          }
        );
      }
    });
  }

  deletePhase() {
    swal({
      title: 'Voulez-vous vraiment supprimer cette phase ?',
      text: '',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: '',
          closeModal: true
        },
        confirm: {
          text: 'Confirmer',
          value: true,
          visible: true,
          className: 'bg-primary',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.en_cours_rp = true;

        let phase: PhaseModel = new PhaseModel();
        phase.idPhase = this.selectedPhase.idPhase;
        this.projetService.savePhase(this.id, 0, phase).then(
          data => {
            this.en_cours_rp = false;
            if (data === 'removed') {
              swal('', 'La phase est bien supprimée  !', 'success');
            }
          },
          error => {console.log('an error cas occured!');
            this.en_cours_rp = false;
            swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
          }
        );
      }
    });
  }

  setUpdatedPhase(up: boolean) {
    this.updatedPhase.idPhase = this.selectedPhase.idPhase;
    this.update = up;
    if (!this.update) {
      this.updatedPhase.dateFin = new Date();
    } else {
      this.updatedPhase.titre = this.selectedPhase.titre;
      this.updatedPhase.description = this.selectedPhase.description;
      this.updatedPhase.dateDebut = new Date(this.selectedPhase.dateDebut);
    }

    this.updatePhaseModal.show();
  }

  updatePhase() {
    this.en_cours_rp = true;

    this.updatePhaseModal.hide();

    let type = (this.updatedPhase.dateFin) ? 2 : 1;

    if (this.updatedPhase != null) {
      this.projetService.savePhase(this.id, type, this.updatedPhase).then(
        data => {
          this.en_cours_rp = false;
          if (data === 'updated') {
            swal('', 'La phase est bien modifiée  !', 'success');
          }
        },
        error => {console.log('an error cas occured!');
          this.en_cours_rp = false;
          swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
        }
      );
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  // ila kan false ghadi nsifto requete m3aha id dial projet bach n3erfouh wash autorisée ola non
  getAccess() {
    this.projetService.getAccess(this.id).then(
      data => {
        if (data === 'true') this.access = true;
        if (data === 'false') this.access = false;
      },
      error => console.log('an error was occured !')
    );
  }

  getPrjAccess(skip: number, type: number) {
    //type === 1 ? this.en_cours_c = true : (type === 2 ? this.en_cours_all = true : this.en_cours_req = true);
    const limit = this.getLimitPrjAccess(type);
    if (limit > 0) {
      let prj: Array<DemandeAccesModel> = new Array<DemandeAccesModel>();
      this.projetService.getAccessPrj(this.id, type, skip, limit).subscribe(
        data => {prj = data; },
        error => { console.log('An error was occured.');
                        type === 1 ? this.en_cours_c = false : (type === 2 ? this.en_cours_all = false : this.en_cours_req = false); },
        () => {console.log('Loading access projects was done.');
          type === 1 ? this.insertIntoDemandes(this.prjAccess, prj) : (type === 2 ? this.insertIntoDemandes(this.prjAccessAll, prj) : this.insertIntoDemandes(this.prjAccessRequested, prj));
          type === 1 ? this.current_prj_access += prj.length : (type === 2 ? this.current_prj_access_all += prj.length : this.current_prj_access_req += prj.length);
          type === 1 ? this.en_cours_c = false : (type === 2 ? this.en_cours_all = false : this.en_cours_req = false);
          console.log('value : ' + !(this.problem.countAccessPrj === 0 || this.problem.countAccessPrj === this.current_prj_access || this.en_cours_c));
          console.log('value1 : ' + (this.problem.countAccessPrj === 0));
          console.log('value2 : ' + (this.problem.countAccessPrj === this.current_prj_access));
          console.log('value3 : ' + (this.en_cours_c));
        }
      );
    }
  }

  deciderDemande(decision: boolean, d: DemandeAccesModel) {
    const dec = decision;
    swal({
      title: 'Voulez-vous vraiment ' + (dec ? 'accepter' : 'refuser') + ' cette demande ?',
      text: '',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: '',
          closeModal: true
        },
        confirm: {
          text: 'Confirmer',
          value: true,
          visible: true,
          className: 'bg-primary',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.en_cours_r = true;

        this.projetService.deciderAcces(dec, d).then(
          data => {
            this.en_cours_r = false;
            if (data === 'decided') {
              swal('', 'Votre choix est bien enregistré !', 'success');
              this.current_prj_access_req = 0;
              this.prjAccessRequested = [];
              this.getPrjAccess(this.skip, 3);
            }
          },
          error => {console.log('an error cas occured!');
            this.en_cours_r = false;
            swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
          }
        );
      }
    });
  }

  demandeAcces() {
    swal({
      title: 'Voulez-vous vraiment demander l\'accès  à ces projets ?',
      text: '',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: '',
          closeModal: true
        },
        confirm: {
          text: 'Confirmer',
          value: true,
          visible: true,
          className: 'bg-primary',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.en_cours_r = true;

        this.en_cours_r = true;
        let projet: ProjetModel = new ProjetModel();
        projet.idPrj = this.id;
        projet.demandesAcces = new Array<DemandeAccesModel>();
        for (let p of this.recommandationsProjetsAccepted) {
          let demandeAcces = new DemandeAccesModel();
          demandeAcces.idPrj = this.id;
          demandeAcces.idRequestedPrj = p.idPrj;
          demandeAcces.etat = 2;
          projet.demandesAcces.push(demandeAcces);
        }

        this.projetService.demanderAcces(projet).then(
          data => {
            this.en_cours_r = false;
            let nbr = parseInt(data);
            if (nbr >= 1) {
              swal('', 'Vos choix sont bien enregistré !', 'success');
              this.recommandationsProjets = [];
              this.recommandationsProjetsAccepted = [];
              this.getRecommendedProjets();

              this.problem.countAccessPrjAll += nbr;
              this.current_prj_access_all = 0;
              this.prjAccessAll = [];
              this.getPrjAccess(this.skip, 2);
            }
          },
          error => {console.log('an error cas occured!');
            this.en_cours_r = false;
            swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
          }
        );
      }
    });
  }

  insertIntoDemandes(demandes: Array<DemandeAccesModel>, dd: Array<DemandeAccesModel>) {
    for (let d of dd) {
      demandes.push(d);
      // console.log(p);
    }
    //console.log(demandes);
  }

  getLimitPrjAccess(type: number): number {
    if (type === 1) return ((this.problem.countAccessPrj - this.current_prj_access) < this.skip ? this.problem.countAccessPrj % this.skip : this.skip);
    if (type === 2) return ((this.problem.countAccessPrjAll - this.current_prj_access_all) < this.skip ? this.problem.countAccessPrjAll % this.skip : this.skip);
    if (type === 3) return ((this.problem.countRequestPrjAll - this.current_prj_access_req) < this.skip ? this.problem.countRequestPrjAll % this.skip : this.skip);
  }

  getUsers(role: string) {
    return this.problem.membres.filter(m => m.roles.includes(role));
  }

  getRole(): boolean {
    if (this.problem.idOwner === this.idUser && this.problem.chef.idU === this.idUser) {this.role = 'Porteur d\'idée + chef'; return true; }
    if (this.problem.idOwner === this.idUser) {this.role = 'Porteur d\'idée'; return true; }
    else if (this.problem.chef.idU === this.idUser) {this.role = 'chef'; return true; }
    else if (this.problem.membres.find(u => (u.idU === this.idUser && u.roles.includes('ROLE_MEMBRE')))) {this.role = 'Membre'; return true; }
    else if (this.problem.membres.find(u => (u.idU === this.idUser && u.roles.includes('ROLE_INVITED')))) {this.role = 'Membre invité'; return true; }
    else return false;
  }

  /*ngAfterViewInit() {
    this.$calendar = $(this.fullcalendar.nativeElement);
    // init calendar plugin
    this.$calendar.fullCalendar(this.calendarOptions);
  }*/

  initSoumission() {
    this.getProblemtById();
    this.usersC = [];
    this.usersM = [];
    this.selectedMembres = [];
    this.dis = false;
    this.soum_not_authorized = false;
    this.soum_not_allowed = false;
    this.res = 'Veuillez saisir un mot clé';
    this.checked = 'pub';
    this.ancien_val_chef = '';
    this.ancien_val_membres = '';

    this.recommandationsUsers = [];
    this.demandesAccepted = [];
    this.recommandationsUsersAccepted = [];

    // this.recommandationsProjets = [];
    // this.recommandationsProjetsAccepted = [];

    this.idChef = '';
    this.invitedUsers = [];
  }

  getRecommendedUsers() {
    this.projetService.getRecommendedUsers(this.id).subscribe(
      data => {console.log(data); this.recommandationsUsers = data; },
      error => console.log('an error was occured !'),
      () => console.log('loading recommended users was done')
    );
  }

  getRecommendedProjets() {
    this.en_cours_mod = true;
    this.projetService.getRecommendedProjets(this.id).subscribe(
      data => {console.log(data); this.recommandationsProjets = data; },
      error => {console.log('an error was occured !'); this.en_cours_mod = false; },
      () => {console.log('loading recommanded projects was done !');  this.en_cours_mod = false; }
      );
  }

  checkIfSelectedBefore(id: string) {
    return (this.selectedMembres.filter(m => m.idU === id).length === 1 || this.idChef === id);
  }

  checkIfAccepted(id: string, n: number): boolean {
    if (n === 1)
      return (this.demandesAccepted.filter(d => d.idU === id).length === 1);

    if (n === 2)
      return (this.recommandationsUsersAccepted.filter(d => d.idU === id).length === 1);

    if (n === 3)
      return (this.recommandationsProjetsAccepted.filter(d => d.idPrj === id).length === 1);
  }

  updateDemande(d: any, action: boolean, n: number) {
    if (n === 1) {
      if (action) this.demandesAccepted.push(d);
      else this.demandesAccepted = this.demandesAccepted.filter(u => u.idU !== d.idU);
    }
    if (n === 2) {
      if (action) this.recommandationsUsersAccepted.push(d);
      else this.recommandationsUsersAccepted = this.recommandationsUsersAccepted.filter(u => u.idU !== d.idU);
    }
    if (n === 3) {
      if (action) this.recommandationsProjetsAccepted.push(d);
      else this.recommandationsProjetsAccepted = this.recommandationsProjetsAccepted.filter(u => u.idPrj !== d.idPrj);
    }
  }

  public selected(value: any, n: number): void {
    if (n === 1) {
      this.usersC = this.usersC.filter(d => d.idU === value);
    }
    if (n === 2 && this.selectedMembres.filter(d => d.idU === value).length < 1) {
      this.selectedMembres.push(this.usersM.find(u => u.idU === value));
    }
  }

  public removed(value: any): void {
    this.selectedMembres = this.selectedMembres.filter(u => u.idU !== value);
  }

  initWhenModif() {
    this.modif = true;
    this.problemModif = new ProjetModel();
    this.problemModif.idPrj = this.id;
    this.problemModif.probTitle = this.problem.probTitle;
    this.problemModif.probDesc = this.problem.probDesc;
    this.problemModif.skills = new Array<SkillModel>();

    this.skl1 = new Array<string>();
    this.skl2 = new Array<string>();
    this.errors = new Array<string>();

    this.loadSkills();

    for(let s of this.problem.skills) {
      this.skl1.push(s.ref);
    }
  }

  public typed(value: any, n: number): void {
    if (n === 1 && this.ancien_val_chef !== value) {
      if (value.length > 0) this.loadUsers(value, 1);
      else {this.usersC = []; this.res = 'Veuillez saisir un mot clé'; }
      this.ancien_val_chef = value;
    }
    if (n === 2 && this.ancien_val_membres !== value) {
      if (value.length > 0) this.loadUsers(value, 2);
      else {this.usersM = this.selectedMembres; this.res = 'Veuillez saisir un mot clé'; }
      this.ancien_val_membres = value;
    }
  }

  loadUsers(str: string, n: number) {
    this.res = 'Chargement des données en cours . . .';
    if (n === 1) {
      this.usersC = [];
      this.userService.getUserLike(str).subscribe(
        data => this.usersC = data ,
        error => {},
        () => {if (this.usersC.length === 0) this.res = 'Aucun résultat'; }
      );
    }
    if (n === 2) {
      this.usersM = this.selectedMembres;
      this.userService.getUserLike(str).subscribe(
        data => {this.usersM = this.usersM.concat(data);
                      this.usersM = this.usersM.filter((a, b, c) => c.findIndex(t => t.idU === a.idU) === b);
        },
        error => {},
        () => {if (this.usersM.length - this.selectedMembres.length === 0) this.res = 'Aucun résultat';
        }
      );
    }
  }

  loadSkills() {
    this.projetService.getAllSkills().subscribe(
      data => {this.Allskills = data; },
      error => {console.log('an error was occured !'); },
      () => {console.log('loading skills was done');}
    );
  }

  onItemAdded($event, n: number) {
    if (n === 1) this.skl2.push($event.value);
    if (n === 2) this.invitedUsers.push($event.value);
  }

  onItemRemoved($event, n: number) {
    if (n === 1) this.skl2 = this.skl2.filter(s => s !== $event.value);
    if (n === 2) this.invitedUsers = this.invitedUsers.filter(s => s !== $event.value);
  }

  controlInformations() {
    this.errors = new Array<string>();
    if (this.problemModif.probDesc.length > 11 && this.problemModif.probTitle.length > 0 && ((this.skl1 && this.skl1.length) || (this.skl2 && this.skl2.length))) {
      return false;
    }
    else {
      if (this.problemModif.probDesc.length <= 11) this.errors.push('Vous devez ajouter une description de votre idée !');
      if (!this.problemModif.probTitle ) this.errors.push('Vous devez saisir un titre à votre idée !');
      if ((!this.skl1 || !this.skl1.length) && (!this.skl2 || !this.skl2.length)) this.errors.push('Vous devez au moins choisir/saisir une compétence !');

      return true;
    }
  }

  controlInformationsSubmit() {
    this.errors = new Array<string>();
    if (this.idChef !== '' && this.selectedMembres.length > 0) {
      return false;
    }
    else {
      if (this.idChef === '') this.errors.push('Vous devez choisir un chef du projet !');
      if (this.selectedMembres.length === 0) this.errors.push('Vous devez sélectionner les membres du projet !');
      return true;
    }
  }

  alert() {
    swal({
      title: 'Veuillez confirmer la modification de votre idée !',
      text: '',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: '',
          closeModal: true
        },
        confirm: {
          text: 'Confirmer',
          value: true,
          visible: true,
          className: 'bg-primary',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.submit();
      }
    });
  }

  submit() {
    this.en_cours_mod = true;
    for (let s of this.skl1) {
      this.problemModif.skills.push(new SkillModel(s));
    }
    if (this.skl2 && this.skl2.length) {
      this.projetService.addSkills(this.skl2).subscribe(
        data => {
          for (let s of data) {
            this.problemModif.skills.push(new SkillModel(s.ref));
          }
        },
        error => {console.log('an error was occured !'); this.is_error = true; this.en_cours = false; },
        () => {console.log(this.problemModif); this.updateProblem(); }
      );
    }
    else this.updateProblem();
  }

  updateProblem() {
    console.log(this.problemModif);
    this.projetService.updateProblem(this.problemModif).then(
      data => {
        console.log(data);
        if (data === 'updated') {
          this.en_cours_mod = false;
          this.redirectToProb();
        }
      },
      error => {console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.is_error = true; this.en_cours_mod = false; }
    );
  }

  redirectToProb() {
    swal({
      title: 'Félicitations!',
      text: 'Votre publication est bien modifiée',
      icon: 'success',
      buttons: {
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: "bg-info",
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      this.init();
      this.getProblemtById();
    });
  }

  socketConnect() {
    const socket = this.wsConfig.getSocket();
    const _this = this;

    if (!this.wsConfig.ws_details) {
      this.wsConfig.ws_details = true;
      socket.addEventListener('message', (event: MessageEvent) => {
        console.log('message from server: ' + event.data);
        const data = event.data.slice(1, -1);
        _this.eventTransformation(data);
      });
    }
  }

  eventTransformation(datas) {
    const infos = datas.split('-');

    if ((infos[0] === 'tache' || infos[0] === 'livrable') && infos[1] === this.id && infos[2] === this.selectedPhase.idPhase) {
      this.selectedPhase.taches = [];
      this.current_count_taches = 0;
      if (this.type_save === 1) this.selectedPhase.countTaches += 1;
      if (this.type_save === 2) this.selectedPhase.countTaches -= 1;
      this.events = [];
      this.getTaches(this.skip);
    }

    if (infos[0] === 'phase' && infos[2] === this.id && this.type === 'planification') {
      if (infos[1] === 'add') this.problem.countPhases += 1;
      if (infos[1] === 'remove') {this.problem.countPhases -= 1; this.selectedPhase = null; }
      if (infos[1] === 'update') this.selectedPhase = null;
      this.current_count_phases = 0;
      this.phases = [];
      this.getPhases(this.skip);
    }

    if (infos[0] === 'phase' && infos[2] === this.id && this.type === 'cal') {
      this.events = [];
      this.allPhases = [];
      this.current_count_taches = 0;
      this.selectedTache = null;
      this.idPhase = '';
      this.getAllPhases();
    }

    if (infos[0] === 'dcdd' && infos[1] === this.id) {
      if (infos[2] === 'true') {
        this.current_prj_access = 0;
        this.problem.countAccessPrj += 1;
        this.prjAccess = [];
        this.getPrjAccess(this.skip, 1);
      }
      if (this.problem.chef.idU === this.idUser) {
        this.current_prj_access_all = 0;
        this.prjAccessAll = [];
        this.getPrjAccess(this.skip, 2);
      }
    }

    if (infos[0] === 'com' && infos[1] === this.id) {
      this.all_comments += 1;
      this.projetService.getComment(this.id, infos[2]).subscribe(
        data => {this.comments.unshift(data); this.current_count_comments += 1; },
        error => { console.log('An error was occured.'); },
        () => {console.log('Loading comment was done.'); }
      );
    }

    if (infos[0] === 'adh' && infos[1] === this.id) {
      if (infos[2] === 'true') {
        if (this.idUser === this.problem.idOwner) {
          this.userService.getUserById(infos[3]).subscribe(
            data => {this.demandes.unshift(data); this.details_d = true; }
          );
        }
      }
      else if (infos[2] === 'false' && this.demandes) {
        this.demandes = this.demandes.filter(d => d.idU !== infos[3]);
        if (this.demandes && this.demandes.length === 0) {
          this.details_d = false;
          this.hide_details_d = false;
        }
      }
    }

    if (infos[0] === 'react' && infos[1] === this.id) {
      if (infos[2] === 'true') {
        this.problem.countLikers += 1;
        if (this.idUser === this.problem.idOwner) {
          this.userService.getUserById(infos[3]).subscribe(
            data => {this.likers.unshift(data); this.details = true; }
          );
        }
      }
      else if (infos[2] === 'false') {
        this.problem.countDislikers += 1;
        if (this.idUser === this.problem.idOwner) {
          this.userService.getUserById(infos[3]).subscribe(
            data => {this.dislikers.unshift(data); this.details = true; }
          );
        }
      }
    }
  }

  verifyReact() {
    if (this.problem.likers && this.problem.likers.find(l => l.idU === this.idUser)) this.react_type = 1;
    if (this.problem.dislikers && this.problem.dislikers.find(l => l.idU === this.idUser)) this.react_type = 0;
  }

  verifyDemande() {
    if (this.problem.demandesAdhesion && this.problem.demandesAdhesion.find(d => d.idU === this.idUser)) this.demande_type = 1;
  }

  getProblemtById() {
    this.en_cours_i = true;
    this.projetService.getProbById(this.id).subscribe(
      data => {this.problem = data; },
      error => { console.log('An error was occured.');
        this.is_error = true;
        this.en_cours_i = false; },
      () => {
        if (this.problem != null) {
          console.log('loading problem was done.');

          if (this.type === 'pub') {
            this.getSkills();
            if (this.problem.countComments > 0) {this.all_comments = this.problem.countComments; this.getComments(10); }
            this.verifyReact(); this.verifyDemande();
            if (this.idUser === this.problem.idOwner) {this.getReacts(); this.getDemandes(); }
          }

          if (this.type === 'soumission') {
            if (this.idUser === this.problem.idOwner) {
              if (!this.problem.isSubmitted) {
                this.getDemandes();
                this.getRecommendedUsers();
              }
              else this.soum_not_allowed = true;
            }
            else this.soum_not_authorized = true;
          }
        }
        else this.not_found = true;
        this.en_cours_i = false;
        }
    );
  }

  getSkills() {
    this.projetService.getSkills(this.id).subscribe(
      data => {this.skills = data; },
      error => {console.log('an error was occured !'); },
      () => {console.log('loading skills was done !'); }
    );
  }

  getReacts() {
    this.projetService.getReacts(this.id, true).subscribe(
      data => {this.likers = data; },
      error => {console.log('an error was occured !'); },
      () => {
        this.projetService.getReacts(this.id, false).subscribe(
          data => {this.dislikers = data; },
          error => {console.log('an error was occured !'); },
          () => {console.log('loading reacts was done !');
            if (this.likers.length > 0 || this.dislikers.length > 0)  this.details = true;
          }
        );
      }
    );
  }

  getDemandes() {
    this.projetService.getDemandes(this.id).subscribe(
      data => {this.demandes = data; },
      error => {console.log('an error was occured !'); },
      () => {
        console.log('loading demandes was done !');
        if (this.demandes.length > 0)  this.details_d = true;
      }
    );
  }

  demandeAdhesion(type: boolean) {
    if (this.authenticationService.isUserLoggedIn() && this.problem.idOwner != this.idUser) {
      swal({
        title: 'Veuillez confirmer votre demande !',
        text: '',
        icon: 'warning',
        buttons: {
          cancel: {
            text: 'Annuler',
            value: null,
            visible: true,
            className: '',
            closeModal: true
          },
          confirm: {
            text: 'Confirmer',
            value: true,
            visible: true,
            className: 'bg-primary',
            closeModal: true
          }
        }
      }).then((isConfirm) => {
        if (isConfirm) {
          this.en_cours_a = true;

          let user: UserModel = new UserModel();
          user.idU = this.idUser;

          this.projetService.demandeAdhesion(user, this.id, type).then(
            data => {
              console.log(data);
              this.en_cours_a = false;
              if (data === 'added') {
                swal('', 'Votre demande est bien enregistrée, vous recevrez un email dans le cas d\'acceptation', 'success');
                this.demande_type = 1;
              }
              if (data === 'removed') {
                swal('', 'Votre demande est bien annulée !', 'success');
                this.demande_type = 0;
              }
            },
            error => {console.log('an error cas occured!');
              this.en_cours_a = false;
              swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
            }
          );
        }
      });
    }
  }

  addComment() {
    this.en_cours = true;
    this.commentaire.idUser = JSON.parse(localStorage.getItem('user')).idU;

    this.projetService.addComment(this.commentaire, this.id).then(
      data => {
        // console.log(data);
        if (data === 'added') {
          this.en_cours = false;
          swal('', 'Votre Commentaire est bien ajouté !', 'success');
          this.commentaire.comment = '';
        }
      },
      error => {console.log('an error cas occured!');
        this.en_cours = false;
        swal('', 'Un erreur est survenu, veuillez ressayer !', 'error'); }
    );
  }

  addReact(react: boolean) {
    if (this.react_type === 2 && this.authenticationService.isUserLoggedIn() && this.problem.probOwner.idU != this.idUser) {
      swal({
        title: 'Veuillez confirmer votre réaction !',
        text: 'Vous ne pouvez pas la changer après votre confirmation ',
        icon: 'warning',
        buttons: {
          cancel: {
            text: 'Annuler',
            value: null,
            visible: true,
            className: '',
            closeModal: true
          },
          confirm: {
            text: 'Confirmer',
            value: true,
            visible: true,
            className: 'bg-primary',
            closeModal: true
          }
        }
      }).then((isConfirm) => {
        if (isConfirm) {
          let user: UserModel = new UserModel();
          user.idU = this.idUser;
          this.en_cours_r = true;

          this.projetService.addReact(user, this.id, react).then(
            data => {
              console.log(data);
              if (data === 'added') {
                this.en_cours_r = false;
                if (react) this.react_type = 1;
                else this.react_type = 0;
              }
            },
            error => {console.log('an error cas occured!');
              this.en_cours_r = false;
              swal('', 'Un erreur est survenu, veuillez ressayer !', 'error');
            }
          );
        }
      });
    }
  }

  tooltipReact(react: boolean) {
    if (!this.authenticationService.isUserLoggedIn()) {
      return 'Vous devez se connecter pour réagir à cette publication !';
    }
    else {
      if (this.react_type <= 1) {
        return 'Vous avez déjà réagi !';
      }
      else {
        if (this.idUser === this.problem.idOwner) {
          return 'Vous ne pouvez pas réagir à votre publication !';
        }
        else return react ? 'J\'aime cette publication' : 'J\'aime plus cette publication';
      }
    }
  }

  isEmpty() {
    return this.commentaire.comment.length <= 10;
  }

  goToLink(id: string, type: string) {
    this.router.navigate([]).then(result => {
      window.open('/app/collaboration/' + id + '/' + type, '_blank');
    });
  }

  soumettre() {
    this.en_cours_s = true;
    this.dis = true;
    let projet: ProjetModel = new ProjetModel();
    projet.idPrj = this.id;
    projet.isPrivate = (this.checked === 'prv');

    projet.idOwner = this.idUser;
    projet.chef = new UserModel();
    projet.chef.idU = this.idChef;

    projet.membres = new Array<UserModel>();
    let allselected = this.selectedMembres.concat(this.demandesAccepted).concat(this.recommandationsUsersAccepted);
    for (let m of allselected) {
      let membre = new UserModel();
      membre.idU = m.idU;
      projet.membres.push(membre);
    }

    projet.invitations = new Array<string>();
    projet.invitations = this.invitedUsers;

    /*projet.demandesAcces = new Array<DemandeAccesModel>();
    for (let p of this.recommandationsProjetsAccepted) {
      let demandeAcces = new DemandeAccesModel();
      demandeAcces.idPrj = this.id;
      demandeAcces.idRequestedPrj = p.idPrj;
      demandeAcces.etat = 2;
      projet.demandesAcces.push(demandeAcces);
    }*/

    this.projetService.soumettreProjet(projet).then(
      data => {
        if (data === 'soumis') {
          this.projetService.deciderProjet(projet.idPrj, true).then(
            data => {
              this.en_cours_s = false;
              this.redirectToInfos();
            }
          );
        }
      },
      error => {console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.en_cours_s = false; this.dis = false; }
    );
    // console.log(projet);
  }

  redirectToInfos() {
    swal({
      title: 'Félicitations, votre projet est bien lancé !',
      //title: 'Félicitations, votre demande est bien soumise !',
      text: '',
      // text: 'Vous recevrez la décision finale après le traitement de votre demande par la commission des projets.',
      icon: 'success',
      buttons: {
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'bg-info',
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      this.router.navigate([]).then(result => {
        window.open('/app/collaboration/' + this.id + '/info');
      });
    });
  }

  getComments(skip: number) {
    this.en_cours_c = true;
    this.checkLimit();
    let com: Array<CommentaireModel> = new Array<CommentaireModel>();
    this.projetService.getComments(this.id, skip, this.checkLimit()).subscribe(
      data => {com = data; },
      error => {console.log('An error was occured.'); this.en_cours_c = false; },
      () => {console.log('Loading comments was done.'); this.insertInArray(com); this.en_cours_c = false; }
    );
  }

  insertInArray(c: Array<CommentaireModel>) {
    for (let cm of c) {
      this.comments.push(cm);
    }
    this.current_count_comments += c.length;
    if (this.comments.length === this.all_comments) this.showMore = false;
  }

  checkLimit() {
    return ((this.all_comments - this.current_count_comments) < 10 ? this.all_comments % 10 : 10);
  }


}
