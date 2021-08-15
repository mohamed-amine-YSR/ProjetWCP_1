import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProjetModel} from '../../../core/model/projet.model';
import {ProjetService} from '../../../core/service/projet.service';
import {SkillModel} from '../../../core/model/skill.model';
import {Observable} from 'rxjs';
import {WS_URL} from '../../../core/service/api.url.config';

@Component({
  selector: 'app-problemes',
  templateUrl: './problemes.component.html',
  styleUrls: ['./problemes.component.scss']
})
export class ProblemesComponent implements OnInit {

  public maxSize: number = 10;
  public numPages;

  public nbrProbs: number = 0;
  public nbrProbsParPage: number = 2;
  public currentPage: number = 0;
  current_count_probs: number = 0;

  is_error: boolean = false;
  no_prob: boolean = false;
  en_cours_p: boolean = false;
  showMore: boolean = true;

  problemes: ProjetModel[] = new Array<ProjetModel>();

  constructor(public router: Router, private projetService: ProjetService) { }

  ngOnInit() {
    this.updateNbrProbs();
    this.getAllProbs();
  }

  socketConnect() {
    const socket = new WebSocket(WS_URL);

    const _this = this;

    socket.addEventListener('message', (event: MessageEvent) => {
      console.log('message from server: ' + event.data);
      const data = event.data.slice(1, -1);
      _this.eventTransformation(data);
    });
  }

  eventTransformation(datas) {
    const infos = datas.split('-');

    if (infos[0] === 'prb') {
      this.projetService.getProbById(infos[1]).subscribe(
        data => {this.problemes.unshift(data);},
        error => { console.log('An error was occured.'); },
        () => {console.log('Loading problem was done.');
          this.current_count_probs += 1; this.nbrProbs += 1;
          if (this.no_prob) this.no_prob = false;}
      );
    }
  }


  getAllProbs() {
    this.en_cours_p = true;
    let prj: Array<ProjetModel> = new Array<ProjetModel>();
    this.projetService.getAllProblems(this.currentPage, 10).subscribe(
      data => {prj = data; },
      error => { console.log('An error was occured.'); this.en_cours_p = false; this.is_error = true; },
      () => { console.log('loading problems was done.');
                      this.insertInArray(prj); this.en_cours_p = false;
                      this.socketConnect();
                      }
    );
  }

  getSkills(id: string): Observable<SkillModel[]> {
    return  this.projetService.getSkills(id);
  }

  updateNbrProbs() {
    this.projetService.countAllProbs().subscribe(
      data => {this.nbrProbs = data;  },
      error => { console.log('An error was occured.'); },
      () => {console.log('Updating the number of problems was done.');
                      if (this.nbrProbs === 0) this.no_prob = true;
                    }
    );
  }

  checkDetails(id: string) {
    this.router.navigate([]).then(result => {
      window.open('/app/collaboration/' + id + '/pub', '_blank');
    });
  }

  insertInArray(prj: Array<ProjetModel>) {
    for (let p of prj) {
      this.problemes.push(p);
    }
    this.current_count_probs += prj.length;
    if (this.current_count_probs === this.nbrProbs) this.showMore = false;
    else this.currentPage += 1;
  }

}
