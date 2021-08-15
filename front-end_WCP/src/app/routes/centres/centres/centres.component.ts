import { Component, OnInit } from '@angular/core';
import {CentreModel} from '../../../core/model/centre.model';
import {CentreService} from '../../../core/service/centre.service';
import {UserModel} from '../../../core/model/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {UserService} from '../../../core/service/user.service';
import {AuthenticationService} from '../../../core/service/authentication.service';
import {Router} from '@angular/router';

declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-centres',
  templateUrl: './centres.component.html',
  styleUrls: ['./centres.component.scss']
})
export class CentresComponent implements OnInit {
  centres: Array<CentreModel> = [];
  membres: Array<UserModel> = [];
  selectedCentre: CentreModel = new CentreModel();
  updatedCentre: CentreModel = null;

  centreForm: FormGroup;

  add: boolean = false;
  add_en_cours: boolean = false;
  update_en_cours: boolean = false;
  newCentre: CentreModel = null;

  public nbrCentres: number = 0;
  public currentPage: number = 0;
  current_count_ctr: number = 0;
  no_centre: boolean = false;
  en_cours_c: boolean = false;
  showMore: boolean = true;
  ddw_type: number = 0;

  public nbrMembres: number = 0;
  public currentPageMem: number = 0;
  current_count_mem: number = 0;
  no_membre: boolean = false;
  en_cours_m: boolean = false;
  showMoreMem: boolean = true;

  res: string = 'Veuillez saisir un mot clé';

  en_cours_act: boolean = false;
  idSelectedUser: string = '';

  constructor(private centreService: CentreService, private userService: UserService, private fb: FormBuilder,
              private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    if (!this.authenticationService.isRoleAuthorized('ROLE_ADMIN')) {
      this.router.navigateByUrl('/');
    }
    this.init();
  }

  init() {
    this.centres = [];
    this.membres = [];
    this.no_centre = false;
    this.en_cours_c = false;
    this.showMore = true;
    this.nbrCentres = 0;
    this.currentPage = 0;
    this.current_count_ctr = 0;
    this.ddw_type = 0;

    this.selectedCentre = null;
    this.updatedCentre = null;

    this.add = false;
    this.add_en_cours = false;
    this.en_cours_act = false;
    this.newCentre = new CentreModel();
    this.newCentre.cigle = '';
    this.newCentre.nom = '';

    this.newCentre.resp = new UserModel();
    this.newCentre.resp.genre = 'm';

    this.idSelectedUser = '';

    this.centreForm = this.fb.group({
      'centre-nom': [null, Validators.required],
      'centre-cigle': [null, Validators.required],
      'nom-resp': [null, Validators.required],
      'pren-resp': [null, Validators.required],
      'mail': [null, Validators.compose([Validators.required, CustomValidators.email])],
    });

    this.updateNbrCentres();
    this.getCentres();
  }

  updateNbrCentres() {
    this.centreService.countAllCentres().subscribe(
      data => {this.nbrCentres = data;  },
      error => { console.log('An error was occured.'); },
      () => {console.log('Updating the number of centers was done.');
        if (this.nbrCentres === 0) this.no_centre = true;
      }
    );
  }

  getCentres() {
    this.en_cours_c = true;
    let ctr: Array<CentreModel> = new Array<CentreModel>();
    this.centreService.getAllCentres(this.currentPage, 10).subscribe(
      data => {ctr = data; },
      error => { console.log('An error was occured.'); this.en_cours_c = false; },
      () => { console.log('loading centres was done.');
        this.insertInArray(ctr); this.en_cours_c = false;
      }
    );
  }

  insertInArray(ctr: Array<CentreModel>) {
    for (let c of ctr) {
      this.centres.push(c);
    }
    this.current_count_ctr += ctr.length;
    if (this.current_count_ctr === this.nbrCentres) this.showMore = false;
    else this.currentPage += 1;
  }

  updateNbrMembres() {
    if (this.selectedCentre.idCentre) {
      this.userService.countUsersInCentre(this.selectedCentre.idCentre, this.selectedCentre.idResp).subscribe(
        data => {this.nbrMembres = data;  },
        error => { console.log('An error was occured.'); },
        () => {console.log('Updating the number of members was done.');
          if (this.nbrMembres === 0) this.no_membre = true;
        }
      );
    }

  }

  getMembres() {
    if (this.selectedCentre.idCentre) {
      this.en_cours_m = true;
      let mem: Array<UserModel> = new Array<UserModel>();
      this.userService.getUsersInCentre(this.selectedCentre.idCentre, this.selectedCentre.idResp, this.currentPageMem, 10).subscribe(
        data => {
          mem = data;
        },
        error => {
          console.log('An error was occured.');
          this.en_cours_m = false;
        },
        () => {
          console.log('loading membres was done.');
          this.insertInMembreArray(mem);
          this.en_cours_m = false;
        }
      );
    }
  }

  insertInMembreArray(mem: Array<UserModel>) {
    for (let m of mem) {
      this.membres.push(m);
    }
    this.current_count_mem += mem.length;
    if (this.current_count_mem === this.nbrMembres) this.showMoreMem = false;
    else this.currentPageMem += 1;
  }

  addCentre() {
    for (let c in this.centreForm.controls) {
      this.centreForm.controls[c].markAsTouched();
    }

    if(this.centreForm.valid) {
      this.add_en_cours = true;
      this.centreService.saveCentre(this.newCentre).then(
        data => {
          if (data === 'saved') {
            swal('', 'Le centre est bien ajouté !', 'success');
            this.init();
          }
        },
        error => {console.log('an error cas occured!');
          swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
          this.add = false;
          this.add_en_cours = false;
        }
      );
    }
  }

  afficherDetails(c: CentreModel) {
    this.selectedCentre = c;
    this.ddw_type = 1;

    this.membres = [];
    this.no_membre = false;
    this.en_cours_m = false;
    this.showMoreMem = true;
    this.nbrMembres = 0;
    this.currentPageMem = 0;
    this.current_count_mem = 0;

    this.update_en_cours = false;

    this.updateNbrMembres();
    this.getMembres();
  }

  afficherModif(c: CentreModel) {
    this.membres = [];
    this.res = 'Veuillez saisir un mot clé';

    this.ddw_type = 2;
    this.updatedCentre = new CentreModel();
    this.updatedCentre.idCentre = c.idCentre;
    this.updatedCentre.nom = c.nom;
    this.updatedCentre.cigle = c.cigle;
    this.updatedCentre.idResp = c.idResp;

    const resp: UserModel = new UserModel();
    resp.idU = c.resp.idU;
    resp.nom = c.resp.nom + ' ' + c.resp.prenom;
    this.membres.push(resp);
  }

  public typed(value: any): void {
      if (value.length > 0) this.loadUsers(value);
      else {this.membres = []; this.res = 'Veuillez saisir un mot clé'; }
  }

  loadUsers(str: string) {
    this.res = 'Chargement des données en cours . . .';
      this.membres = [];
      this.userService.getUserLikeAndInCentre(str, this.updatedCentre.idCentre, this.updatedCentre.idResp).subscribe(
        data => this.membres = data ,
        error => {},
        () => {if (this.membres.length === 0) this.res = 'Aucun résultat'; }
      );
  }

  updateCentre() {
    this.update_en_cours = true;
    this.centreService.updateCentre(this.updatedCentre).then(
      data => {
        if (data === 'updated') {
          swal('', 'les informations du centre sont bien modifiées !', 'success');
          this.update_en_cours = false;
          this.ddw_type = 0;
          this.init();
        }
      },
      error => {console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.update_en_cours = false;
        this.ddw_type = 0;
      }
    );
  }

  confirmReInit(idUser: string) {
    this.idSelectedUser = idUser;
    swal({
      title: 'Voulez-vous vraiment réinitialiser le mot de passe de ce membre ?',
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
        this.reInitPassword();
      }
    });
  }

  reInitPassword() {
    this.en_cours_act = true;
    this.userService.reInitPassword(this.idSelectedUser).then(
      data => {
        if (data === 'updated') {
          swal('', 'Le mot de passe de ce membre est réinitialisé!', 'success');
          this.en_cours_act = false;
        }
      },
      error => {
        console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.en_cours_act = false;
      }
    );
  }
}
