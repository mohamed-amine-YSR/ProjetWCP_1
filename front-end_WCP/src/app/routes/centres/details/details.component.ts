import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/service/authentication.service';
import {Router} from '@angular/router';
import {CentreService} from '../../../core/service/centre.service';
import {CentreModel} from '../../../core/model/centre.model';
import {UserModel} from '../../../core/model/user.model';
import {UserService} from '../../../core/service/user.service';

declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {

  idCentre: string = '';
  idResp: string = '';
  centre: CentreModel = null;
  add: boolean = false;
  membresAdd: Array<UserModel> = [];

  en_cours_add: boolean = false;

  searchMember: UserModel;

  membres: Array<UserModel> = [];
  nbrMembres: number = 0;
  currentPageMem: number = 0;
  current_count_mem: number = 0;
  no_membre: boolean = false;
  filtred: boolean = false;
  en_cours_m: boolean = false;
  showMoreMem: boolean = true;

  en_cours_act: boolean = false;
  idSelectedUser: string = '';

  constructor(private authenticationService: AuthenticationService, private router: Router, private centreService: CentreService,
              private userService: UserService) {
  }

  ngOnInit() {
    if (!this.authenticationService.isRoleAuthorized('ROLE_RESP')) {
      this.router.navigateByUrl('/');
    }

    this.searchMember = new UserModel();
    this.searchMember.active = true;
    this.searchMember.nom  = '';

    this.idCentre = JSON.parse(localStorage.getItem('user')).idCentre;
    this.idResp = JSON.parse(localStorage.getItem('user')).idU;
    this.centre = new CentreModel();
    this.getInformationsCentre();
    this.init();
  }

  init() {
    this.membres = [];
    this.no_membre = false;
    this.en_cours_m = false;
    this.filtred = false;
    this.en_cours_add = false;
    this.add = false;
    this.showMoreMem = true;
    this.nbrMembres = 0;
    this.currentPageMem = 0;
    this.current_count_mem = 0;

    this.en_cours_act = false;
    this.idSelectedUser = '';

    this.updateNbrMembres();
  }

  prepareAdd() {
    this.add = true;
    this.membresAdd = [];
    this.addMembre();
  }

  addMembre() {
    this.membresAdd = [...this.membresAdd, new UserModel()];
  }

  retirerMem(m: UserModel) {
    this.membresAdd = this.membresAdd.filter((mem) => mem !== m);
  }

  getInformationsCentre() {
    this.centreService.getCentreById(this.idCentre).subscribe(
      data => {
        this.centre = data;
      },
      error => {
        console.log('An error was occured.');
      },
      () => {
        console.log('loading infos centre was done.');
      }
    );
  }

  validateEmail(m: string) {
    const email_regex = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return email_regex.test(m);
  }

  verifyAllInput(): boolean {
    for (let m of this.membresAdd) {
      if (!m.nom || !m.prenom || !this.validateEmail(m.email) || !m.genre) {
        return false;
      }
    }
    return true;
  }

  addAllMembres() {
    this.en_cours_add = true;
    for (let m of this.membresAdd) {
      m.active = true;
      m.idCentre = this.idCentre;
      m.roles = ['ROLE_MEMBRE'];
    }
    this.userService.addMembresCentre(this.membresAdd).then(
      data => {
        if (data === 'added') {
          swal('Les membres sont bien ajoutés !',
            'Chaque membre peut accéder à la platforme en utilisant son émail (mentionné dans le formulaire) et son mot de passe (la chaine de caractère avant le \'@\' de son émail)',
            'success');
          this.init();
        }
      },
      error => {
        console.log('an error cas occured!');
        this.en_cours_add = false;
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
      }
    );
  }

  updateNbrMembres() {
    if (this.centre) {
      this.userService.countUsersInCentre(this.idCentre, this.idResp).subscribe(
        data => {
          this.nbrMembres = data;
        },
        error => {
          console.log('An error was occured.');
        },
        () => {
          console.log('Updating the number of members was done.');
          if (this.nbrMembres === 0) {
            this.no_membre = true;
          }
          else {
            this.getMembres();
          }
        }
      );
    }
  }

  getMembres() {
    if (this.centre) {
      this.en_cours_m = true;
      let mem: Array<UserModel> = new Array<UserModel>();
      this.userService.getUsersInCentre(this.idCentre, this.idResp, this.currentPageMem, 10).subscribe(
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
    if (this.current_count_mem >= this.nbrMembres) {
      this.showMoreMem = false;
    } else {
      this.currentPageMem += 1;
    }
  }

  setEtat(etat: boolean, mem: UserModel) {
    this.idSelectedUser = mem.idU;
    this.en_cours_act = true;
    this.userService.setEtat(etat, mem.idU).then(
      data => {
        if (data === 'updated') {
          swal('', 'Le compte de ce membre est ' + (etat ? 'activé' : 'désactivé') + ' !', 'success');
          this.en_cours_act = false;
          mem.active = etat;
        }
      },
      error => {
        console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.en_cours_act = false;
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

  confirmDisable(etat: boolean, mem: UserModel) {
    swal({
      title: 'Voulez-vous vraiment ' + (etat ? 'activer' : 'désactiver') + ' le compte de ce membre ?',
      text: etat ? '' : 'Après cette action, ce membre ne peut plus se connecter à son compte !',
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
        this.setEtat(etat, mem);
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

  filterUsers() {
    this.membres = [];
    this.en_cours_m = true;
    this.filtred = true;
    this.userService.filterUsersInCentre(this.searchMember.nom, this.searchMember.active, this.idCentre).subscribe(
      data => {
        this.membres = data;
      },
      error => {
        console.log('An error was occured.');
        this.en_cours_m = false;
      },
      () => {
        console.log('loading filtred membres was done.');
        this.en_cours_m = false;
      }
    );
  }
}
