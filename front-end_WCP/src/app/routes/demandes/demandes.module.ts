import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import {DemandesComponent} from './demandes.component';

const routes: Routes = [
  { path: '', component: DemandesComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DemandesComponent],
  exports: [
    RouterModule
  ]
})
export class DemandesModule { }
