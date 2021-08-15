import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {UserModel} from '../../core/model/user.model';
import {ProjetService} from '../../core/service/projet.service';
import {SkillModel} from '../../core/model/skill.model';
import {UserService} from '../../core/service/user.service';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  valForm: FormGroup;
  passwordForm: FormGroup;
  user: UserModel;

  skl1: Array<string>;
  skl2: Array<string>;
  skills = new Array<SkillModel>();

  en_cours: boolean = false;

  constructor(private projetService: ProjetService, private userService: UserService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.init();
  }

  init() {
    const password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,}$')]));
    const certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.passwordForm = this.fb.group({
      'password': password,
      'confirmPassword': certainPassword
    });

    this.valForm = this.fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'nom': [null, Validators.required],
      'prenom': [null, Validators.required],
      'centre': [null, Validators.required],
      'passwordGroup': this.passwordForm
    });

    this.loadSkills();
    this.user = new UserModel();
    this.user.genre = 'm';
    this.user.active = false;
    this.user.demande = 1;
    this.user.skills = [];
    this.skl1 = [];
    this.skl2 = [];
    this.skills = [];
  }

  loadSkills() {
    this.projetService.getAllSkills().subscribe(
      data => {this.skills = data; },
      error => {console.log('an error was occured !'); },
      () => {console.log('loading skills was done'); }
    );
  }

  onItemAdded($event) {
    this.skl2.push($event.value);
  }

  onItemRemoved($event) {
    this.skl2 = this.skl2.filter(s => s !== $event.value);
  }

  submitForm($ev, value: any) {
    this.en_cours = true;
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    for (let c in this.passwordForm.controls) {
      this.passwordForm.controls[c].markAsTouched();
    }

    if (this.valForm.valid) {
      for (let s of this.skl1) {
        this.user.skills.push(new SkillModel(s));
      }
      if (this.skl2 && this.skl2.length) {
        this.projetService.addSkills(this.skl2).subscribe(
          data => {
            for (let s of data) {
              this.user.skills.push(new SkillModel(s.ref));
            }
          },
          error => {console.log('an error was occured !');
            swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
            this.en_cours = false; },
          () => {this.addUser(); }
        );
      }
      else this.addUser();
    }
  }

  addUser() {
    this.userService.addMembreInsc(this.user).then(
      data => {
        if (data === 'added') {
          this.en_cours = false;
          this.init();
          swal('', 'Votre demande pour rejoindre la plateforme est bien soumise, vous recevrez un mail au cas ou elle est acceptée !', 'success');
        }
      },
      error => {console.log('an error cas occured!');
        swal('', 'Un erreur est survenu de coté serveur, veuillez ressayer !', 'error');
        this.en_cours = false;}
    );
  }

}
