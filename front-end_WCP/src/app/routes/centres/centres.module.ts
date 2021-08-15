import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import {CentresComponent} from './centres/centres.component';
import {NgxSelectModule} from 'ngx-select-ex';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: CentresComponent, pathMatch: 'full' },
  { path: 'membres', component: DetailsComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxSelectModule
  ],
  declarations: [CentresComponent, DetailsComponent],
  exports: [
    RouterModule
  ]
})
export class CentresModule { }
