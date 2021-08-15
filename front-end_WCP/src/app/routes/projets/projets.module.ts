import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import {ProjetsComponent} from './projets/projets.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: ProjetsComponent },
  { path: ':id', component: DetailsComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProjetsComponent, DetailsComponent],
  exports: [
    RouterModule
  ]
})
export class ProjetsModule { }
