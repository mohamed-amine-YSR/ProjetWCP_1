import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import {NgxSummernoteModule} from 'ngx-summernote';
import {NewprojetComponent} from './newprojet.component';
import {TagInputModule} from 'ngx-chips';
import {NgxSelectModule} from 'ngx-select-ex';

const routes: Routes = [
  { path: '', component: NewprojetComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxSummernoteModule,
    NgxSelectModule,
    TagInputModule
  ],
  declarations: [
    NewprojetComponent
  ],
  exports: [
    RouterModule
  ]
})
export class NewprojetModule { }
