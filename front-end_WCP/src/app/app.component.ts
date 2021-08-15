import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';

import { SettingsService } from './core/settings/settings.service';
import { AuthenticationService } from './core/service/authentication.service';
import {Router} from '@angular/router';
import {WsConfig} from './core/service/ws.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.getLayoutSetting('isFixed'); };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.getLayoutSetting('isCollapsed'); };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.getLayoutSetting('isBoxed'); };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.getLayoutSetting('useFullLayout'); };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.getLayoutSetting('hiddenFooter'); };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.getLayoutSetting('horizontal'); };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.getLayoutSetting('isFloat'); };
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.getLayoutSetting('offsidebarOpen'); };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.getLayoutSetting('asideToggled'); };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.getLayoutSetting('isCollapsedText'); };

    constructor(public settings: SettingsService, public authenticationService: AuthenticationService, public router: Router, private wsConfig: WsConfig) { }

    ngOnInit() {
      if (this.authenticationService.isUserLoggedIn()) {
        this.authenticationService.validateToken().then(
          data => {
            if (data !== 'valid') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              this.router.navigateByUrl('/app/login');
            }
            else {
              if (!this.wsConfig.ws_app) {
                this.wsConfig.getSocket();
                this.wsConfig.ws_app = true;
              }
            }
          }
        );
      }

      document.addEventListener('click', e => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'A') e.preventDefault();
      });

    }

    ngOnDestroy() {
      this.wsConfig.ws_app = false;
      this.wsConfig.closeSocket();
    }
}
