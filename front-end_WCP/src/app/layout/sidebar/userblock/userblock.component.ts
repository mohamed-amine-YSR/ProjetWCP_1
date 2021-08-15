import { Component, OnInit } from '@angular/core';

import { UserblockService } from './userblock.service';
import {AuthenticationService} from '../../../core/service/authentication.service';
import {UserModel} from '../../../core/model/user.model';

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    user: any;
    picture = 'assets/img/user/';
    constructor(public userblockService: UserblockService, public authenticationService: AuthenticationService) {
    }

    ngOnInit() {
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
      this.picture += this.userInformations().genre + '.png';
    }

    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }

    userInformations() {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      }
      return '';
    }

}
