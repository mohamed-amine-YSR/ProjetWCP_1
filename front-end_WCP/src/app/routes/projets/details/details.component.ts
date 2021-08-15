import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjetModel} from '../../../core/model/projet.model';
import {ProjetService} from '../../../core/service/projet.service';
import {ColorsService} from '../../../shared/colors/colors.service';
import {PhaseModel} from '../../../core/model/phase.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public id: string;
  public projet: ProjetModel;
  public selectedPhase: PhaseModel;

  pieOptions = {
    animate: {
      duration: 800,
      enabled: true
    },
    barColor: this.colors.byName('green'),
    trackColor: this.colors.byName('warning'),
    scaleColor: false,
    lineWidth: 10,
    lineCap: 'round',
    size: 145
  };

  constructor(public colors: ColorsService, private route: ActivatedRoute, private projetService: ProjetService) {
    this.route.params.subscribe(params => this.id = params['id']);
  }

  ngOnInit() {
    this.getProjectById();
  }

  getProjectById() {
    this.projetService.getProjectById(this.id).subscribe(
      data => {this.projet = data; console.log(data); },
      error => { console.log('An error was occured.'); },
      () => {console.log('loading project was done.'); }
    );
  }

}
