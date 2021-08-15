import { Component, OnInit } from '@angular/core';
import {ColorsService} from '../../../shared/colors/colors.service';
import {ProjetService} from '../../../core/service/projet.service';
import {ProjetModel} from '../../../core/model/projet.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {

  sparkOptionsInfo = {
    type: 'pie',
    sliceColors: [this.colors.byName('gray-lighter'), this.colors.byName('info')],
    height: 24
  };

  sparkOptionsWarning = {
    type: 'pie',
    sliceColors: [this.colors.byName('gray-lighter'), this.colors.byName('warning')],
    height: 24
  };

  sparkOptionsSuccess = {
    type: 'pie',
    sliceColors: [this.colors.byName('gray-lighter'), this.colors.byName('success')],
    height: 24
  };


  public maxSize: number = 10;
  public nbrProjets: number = 0;
  public nbrProjetsParPage: number = 1;
  public currentPage: number = 1;
  public numPages;

  projets: ProjetModel[];

  constructor(public colors: ColorsService, public router: Router, private projetService: ProjetService) { }

  ngOnInit() {
    this.updateNbrProjets();
    this.getPublicProjects(0, this.nbrProjetsParPage);
  }

  public setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  public pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.getPublicProjects(event.page - 1 , this.nbrProjetsParPage);
  }

  updateNbrProjets() {
    this.projetService.countPublicProjects().subscribe(
      data => {this.nbrProjets = data; console.log(this.nbrProjets); },
      error => { console.log('An error was occured.'); },
      () => {console.log('Updating the number of public projects was done.'); }
    );
  }

  getPublicProjects(page: number, size: number) {
    //this.projets.splice(0, this.projets.length);
    this.projetService.getAllPublicProjects(page, size).subscribe(
      data => {this.projets = data; },
      error => { console.log('An error was occured.'); },
      () => {console.log('loading public projects was done.'); }
    );
  }

  updateBadge(pourcentage: number) {
    let params = {
      badge_text: '',
      badge_style: '',
      progress_style: ''
    };
    if (pourcentage == 0) {
      params.badge_text = 'commencé'; params.badge_style = 'badge-purple';
    }
    if (pourcentage > 0 && pourcentage < 100) {
      params.badge_text = 'en cours'; params.badge_style = 'badge-info'; params.progress_style = 'info';
    }
    if (pourcentage == 100) {
      params.badge_text = 'terminé'; params.badge_style = 'badge-green'; params.progress_style = 'success';
    }

    return params;
  }

  checkDetails(id: string) {
    this.router.navigate([]).then(result => {
      window.open('/projets/' + id, '_blank');
    });
  }
}
