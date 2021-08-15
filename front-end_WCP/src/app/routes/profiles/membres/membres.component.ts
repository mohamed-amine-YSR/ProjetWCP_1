import { Component, OnInit } from '@angular/core';
import {UserModel} from '../../../core/model/user.model';
import {UserService} from '../../../core/service/user.service';

declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-membres',
  templateUrl: './membres.component.html',
  styleUrls: ['./membres.component.scss']
})
export class MembresComponent implements OnInit {

  nbrMembres: number = 0;
  no_membre: boolean = false;

  en_cours: boolean = false;

  membres: Array<UserModel> = [];

  currentPageMem: number = 0;
  currentCountMem: number = 0;
  showMore: boolean = true;
  en_cours_act: boolean = false;

  idSelectedUser: string = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.nbrMembres = 0;
    this.no_membre = false;
    this.en_cours = false;
    this.en_cours_act = false;
    this.membres = [];
    this.currentPageMem = 0;
    this.currentCountMem = 0;
    this.showMore = true;
    this.idSelectedUser = '';

    this.updateNbrMembres();
  }

  updateNbrMembres() {
      this.userService.countUsersByDemande(1).subscribe(
        data => {this.nbrMembres = data;  },
        error => { console.log('An error was occured.'); },
        () => {console.log('Updating the number of demandes was done.');
          if (this.nbrMembres === 0) this.no_membre = true;
          else this.getMembres();
        }
      );
  }

  getMembres() {
    this.en_cours = true;
    let mem: Array<UserModel> = new Array<UserModel>();
    this.userService.getUsersByDemande(1, this.currentPageMem, 10).subscribe(
      data => {
        mem = data;
      },
      error => {
        console.log('An error was occured.');
        this.en_cours = false;
      },
      () => {
        console.log('loading membres was done.');
        this.insertInMembreArray(mem);
        this.en_cours = false;
      }
    );
  }

  confirmEtat(idUser: string, etat: boolean) {
    this.idSelectedUser = idUser;
    swal({
      title: 'Voulez-vous vraiment accepter cette demande ?',
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
        this.setEtat(etat);
      }
    });
  }

  setEtat(etat: boolean) {
    this.en_cours_act = true;
    this.userService.setEtatDemande(etat, this.idSelectedUser).then(
      data => {
        if (data === 'updated') {
          swal('', 'Cette demande est bien acceptée !', 'success');
          this.en_cours_act = false;
          this.init();
        }
      },
      error => {
        console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.en_cours_act = false;
      }
    );
  }

  insertInMembreArray(mem: Array<UserModel>) {
    for (let m of mem) {
      this.membres.push(m);
    }
    this.currentCountMem += mem.length;
    if (this.currentCountMem === this.nbrMembres) this.showMore = false;
    else this.currentPageMem += 1;
  }


}
