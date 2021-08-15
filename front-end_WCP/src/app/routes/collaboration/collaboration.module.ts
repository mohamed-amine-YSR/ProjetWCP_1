import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from '../../shared/shared.module';
import {ProblemesComponent} from './problemes/problemes.component';
import {DetailsComponent} from './details/details.component';
import {NgxSummernoteModule} from 'ngx-summernote';
import {InformationComponent} from './information/information.component';
import {CommonModule} from '@angular/common';
import {NgxSelectModule} from 'ngx-select-ex';
import {TagInputModule} from 'ngx-chips';
import {AuthGuardService} from '../../core/service/auth-guard.service';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

const routes: Routes = [
  { path: '', component: ProblemesComponent, pathMatch: 'full' },
  { path: ':id', redirectTo: ':id/pub' },
  { path: ':id/:type', component: DetailsComponent },
  { path: 'informations/:id', component: InformationComponent, canActivate: [AuthGuardService] },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        NgxSummernoteModule,
        CommonModule,
        NgxSelectModule,
        TagInputModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
    ],
  declarations: [ProblemesComponent, DetailsComponent, InformationComponent],
  exports: [
    RouterModule
  ]
})
export class CollaborationModule { }
