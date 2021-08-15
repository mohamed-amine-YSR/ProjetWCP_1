import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SettingsService} from '../../core/settings/settings.service';
import {Router} from '@angular/router';
import {CustomValidators} from 'ng2-validation';
import {AuthenticationService} from '../../core/service/authentication.service';
import {UserService} from '../../core/service/user.service';
import {UserModel} from '../../core/model/user.model';
import {ProjetService} from '../../core/service/projet.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  valForm: FormGroup;
  en_cours: boolean = false;
  errorLogin: boolean = false ;
  credentials = {
    email: '',
    password: ''
  };

  constructor(public settings: SettingsService, fb: FormBuilder, private authenticationService: AuthenticationService,
              private userService: UserService, private projetService: ProjetService, private router: Router) {

    this.valForm = fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'password': [null, Validators.required]
    });

  }

  ngOnInit() {
    if (this.authenticationService.isUserLoggedIn()) this.router.navigateByUrl('/app/home');
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.login();
    }
  }

  login() {
    this.en_cours = true;
    this.authenticationService.authenticate(this.credentials).then(
      data => { if (data.length > 0) {
                    localStorage.setItem('token', 'Bearer ' + data);
                    this.redirection(); }
              },
      error => {console.log('error login'); this.errorLogin = true; this.en_cours = false; }
    );
  }

  redirection() {
    this.userService.getUserByEmail(this.credentials.email).subscribe(
      data => { localStorage.setItem('user', JSON.stringify(data));
        let user: UserModel;
        user = JSON.parse(localStorage.getItem('user'));
        },
      error => {console.log('an error was occured !'); }
    );

    this.projetService.getMyPrj().subscribe(
      data => localStorage.setItem('prj', JSON.stringify(data)),
      error => console.log('an error wad occured !')
    );

    this.router.navigateByUrl('/app/collaboration');
  }
}
