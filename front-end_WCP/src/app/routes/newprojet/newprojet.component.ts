import { Component, OnInit } from '@angular/core';
import {ProjetService} from '../../core/service/projet.service';
import {ProjetModel} from '../../core/model/projet.model';
import {Router} from '@angular/router';
import {SkillModel} from '../../core/model/skill.model';
import {forEach} from '@angular/router/src/utils/collection';
import {UserModel} from '../../core/model/user.model';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-newprojet',
  templateUrl: './newprojet.component.html',
  styleUrls: ['./newprojet.component.scss']
})
export class NewprojetComponent implements OnInit {
  skl1: Array<string>;
  skl2: Array<string>;
  errors: Array<string>;
  skills = new Array<SkillModel>();

  projet: ProjetModel = new ProjetModel();
  idProbFromServer: string;
  en_cours: boolean = false;
  is_error: boolean = false;

  dis: boolean = false;

  skillsExist: boolean = false;

  constructor(private projetService: ProjetService, private router: Router) { }

  ngOnInit() {
    this.loadSkills();
    this.init();
    // this.projet.probOwner = new UserModel();
    // this.projet.skills = new Array<string>();
  }

  init() {
    this.projet.idOwner = JSON.parse(localStorage.getItem('user')).idU;
    this.projet.probTitle = '';
    this.projet.skills = new Array<SkillModel>();
    this.skl1 = new Array<string>();
    this.skl2 = new Array<string>();
    this.errors = new Array<string>();
    this.idProbFromServer = '';
    this.dis = false;

    $('#summernote').summernote({
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
      placeholder: 'Décrivez ici votre idée de départ, vous pouvez aussi mettre des liens vers des sites web ou bien des fichiers',
      callbacks: {
        onChange: (contents, $editable) => {
          this.projet.probDesc = contents;
          // console.log(contents);
        }
      }
    });
    $('#summernote').summernote('code', '');
  }

  alert() {
      swal({
        title: 'Veuillez confirmer la publication de votre idée !',
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
    this.en_cours = true;
    this.dis = true;
    for (let s of this.skl1) {
      this.projet.skills.push(new SkillModel(s));
    }
    if (this.skl2 && this.skl2.length) {
      this.projetService.addSkills(this.skl2).subscribe(
        data => {
          for (let s of data) {
            this.projet.skills.push(new SkillModel(s.ref));
          }
        },
        error => {console.log('an error was occured !'); this.is_error = true; this.en_cours = false; },
        () => {console.log(this.projet);this.addProblem(); }
      );
    }
    else this.addProblem();
  }

  addProblem() {
    this.projetService.addProblem(this.projet).then(
      data => {
         console.log(data);
        if (data.length > 0) {
          this.en_cours = false;
          this.redirectToProb(data);
        }
      },
      error => {console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.is_error = true; this.en_cours = false; this.dis = false; }
    );
  }

  redirectToProb(data: string) {
    swal({
      title: 'Félicitations!',
      text: 'Votre idée est bien lancée, Si vous voulez se rediriger vers les détails de votre idée, vous pouvez cliquer sur "OK"',
      icon: 'success',
      buttons: {cancel: {
          text: 'Annuler',
          value: null,
          visible: true,
          className: "",
          closeModal: true
        },
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: "bg-info",
          closeModal: true
        }
      }
    }).then((isConfirm) => {
      if (isConfirm) {
        this.router.navigateByUrl('/app/collaboration/' + data + '/pub');
      }
    });
    this.init();
  }

  loadSkills() {
    this.projetService.getAllSkills().subscribe(
      data => {this.skills = data; },
      error => {console.log('an error was occured !'); },
      () => {console.log('loading skills was done'); if (this.skills.length > 0) this.skillsExist = true; }
    );
  }

  onItemAdded($event) {
    this.skl2.push($event.value);
  }

  onItemRemoved($event) {
    this.skl2 = this.skl2.filter(s => s !== $event.value);
  }

  controlInformations() {
    this.errors = new Array<string>();
    if (!$('#summernote').summernote('isEmpty') && this.projet.probTitle.length > 0 && ((this.skl1 && this.skl1.length) || (this.skl2 && this.skl2.length))) {
      return false;
    }
    else {
      if ($('#summernote').summernote('isEmpty')) this.errors.push('Vous devez ajouter une description de votre idée !');
      if (!this.projet.probTitle ) this.errors.push('Vous devez saisir un titre à votre idée !');
      if ((!this.skl1 || !this.skl1.length) && (!this.skl2 || !this.skl2.length)) this.errors.push('Vous devez au moins choisir/saisir une compétence !');

      return true;
    }
  }
}
