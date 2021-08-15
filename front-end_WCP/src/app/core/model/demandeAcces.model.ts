import {ProjetModel} from './projet.model';

export class DemandeAccesModel {
  constructor(public idD?: string,
              public idPrj?: string,
              public idRequestedPrj?: string,
              public etat?: number,
              public dateDemande?: Date,
              public dateDecision?: Date,
              public projet?: ProjetModel,
  ) {}
}
