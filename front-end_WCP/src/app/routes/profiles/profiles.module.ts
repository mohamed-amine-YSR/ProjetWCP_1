import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { DetailsComponent } from './details/details.component';
import {MembresComponent} from './membres/membres.component';

const routes: Routes = [
  { path: '', component: MembresComponent },
  { path: ':id', component: DetailsComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MembresComponent, DetailsComponent],
  exports: [
    RouterModule
  ]
})
export class ProfilesModule { }
