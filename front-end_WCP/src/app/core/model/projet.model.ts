import {PhaseModel} from './phase.model';
import {UserModel} from './user.model';
import {SkillModel} from './skill.model';
import {DisciplineModel} from './discipline.model';
import {CommentaireModel} from './commentaire.model';
import {DemandeAccesModel} from './demandeAcces.model';

export class ProjetModel {
  constructor(public idPrj?: string,
              public idOwner?: string,
              public probOwner?: UserModel,
              public probTitle?: string,
              public probDesc?: string,
              public probDate?: Date,
              public dateSoumission?: Date,
              public dateAffectation?: Date,
              public commentaires?: CommentaireModel[],

              public demandesAcces?: DemandeAccesModel[],
              public invitations?: string[],

              public titre?: string,
              public description?: string,
              public isPrivate?: boolean,
              public isPaused?: boolean,
              public isSubmitted?: boolean,
              public disableComments?: boolean,
              public etat?: number,
              public budget?: number,
              public phases?: PhaseModel[],
              public dateDebut?: Date,
              public dateFin?: Date,
              public chef?: UserModel,
              public membres?: UserModel[],
              public likers?: UserModel[],
              public dislikers?: UserModel[],
              public demandesAdhesion?: UserModel[],
              public skills?: SkillModel[],
              public discipline?: DisciplineModel,

              public motifsRefus?: string,
              public idDecideur?: string,

              public countPhases?: number,
              public countMembres?: number,
              public countTaches?: number,
              public countTachesCompleted?: number,
              public pourcentageCompleted?: number,
              public countAccessPrj?: number,
              public countAccessPrjAll?: number,
              public countRequestPrj?: number,
              public countRequestPrjAll?: number,
              public countComments?: number,
              public countLikers?: number,
              public countDislikers?: number
              ) {}
}
