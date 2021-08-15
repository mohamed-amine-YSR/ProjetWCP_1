import {SkillModel} from './skill.model';

export class UserModel {
  constructor(public idU?: string,
              public nom?: string,
              public prenom?: string,
              public genre?: string,
              public email?: string,
              public idCentre?: string,
              public centre?: string,
              public password?: string,
              public active?: boolean,
              public demande?: number,
              public roles?: string[],
              public skills?: SkillModel[],
              ) {
  }

  get fullName (): string {
    return (this.genre === 'f' ? 'Mme.' : 'Mr.') + ' ' + this.nom.toUpperCase() + ' ' + this.prenom;
  }
}
