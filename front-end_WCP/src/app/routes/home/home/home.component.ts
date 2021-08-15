import { Component, OnInit } from '@angular/core';
import { RichTextEditor, Toolbar, Link, Image, HtmlEditor, QuickToolbar } from '@syncfusion/ej2-richtexteditor';
RichTextEditor.Inject(Toolbar, Link, HtmlEditor, Image, QuickToolbar);
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    value: string;

    constructor() { }

    ngOnInit() {
    }

}
