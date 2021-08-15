import { Component, OnInit } from '@angular/core';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss', './information.css']
})
export class InformationComponent implements OnInit {

  contents: string;
  currentStep: number = 2;
  public value: any = {};
  public items: Array<string> = ['SALIHI Ibrahim', 'BENNANI Kawtar', 'SARHAN Amine', 'AZIZI Salah', 'MAWHOUB Hicham',
                                'ELWAHABI Reda', 'CHADILI Mouna', 'FAQIHI Samia', 'TAJILI Mehdi', 'QADIRI Othmane'];

  constructor() { }

  ngOnInit() {
    $('#summernote').summernote({
      lang: 'fr-FR',
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['view', ['fullscreen', 'undo', 'redo']],
      ],
      height: 200,
      placeholder: 'Décrivez ici votre projet',
      callbacks: {
        onChange: (contents, $editable) => {
          this.contents = contents;
          // console.log(contents);
        }
      }
    });
  }

  sweetAlert() {
    swal("Informations enregistrées !", "Votre projet est bien lancé !", "success");
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

}
