import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {RichTextEditorModule} from '@syncfusion/ej2-angular-richtexteditor';
import {NgxSummernoteModule} from 'ngx-summernote';

const routes: Routes = [
    { path: '', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    RichTextEditorModule,
    NgxSummernoteModule
  ],
    declarations: [HomeComponent],
    exports: [
        RouterModule
    ]
})
export class HomeModule { }
