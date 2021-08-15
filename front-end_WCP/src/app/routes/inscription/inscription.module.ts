import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {InscriptionComponent} from './inscription.component';
import {NgxSelectModule} from 'ngx-select-ex';
import {TagInputModule} from 'ngx-chips';

const routes: Routes = [
  { path: '', component: InscriptionComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    NgxSelectModule,
    TagInputModule
  ],
  declarations: [InscriptionComponent],
  exports: [
    RouterModule
  ]
})
export class InscriptionModule { }
