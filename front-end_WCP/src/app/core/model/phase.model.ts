import {TacheModel} from './tache.model';

export class PhaseModel {
  constructor(public idPhase?: string,
              public titre?: string,
              public description?: string,
              public dateDebut?: Date,
              public dateFin?: Date,
              public countTaches?: number,
              public taches?: TacheModel[]) {}
}
