import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthComponent} from './auth.component';
import {SharedModule} from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: AuthComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [AuthComponent],
  exports: [
    RouterModule
  ]
})
export class AuthModule { }
