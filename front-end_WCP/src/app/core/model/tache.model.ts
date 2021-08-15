import {UserModel} from './user.model';

export class TacheModel {
  constructor(public ref?: string,
              public title?: string,
              public idMembre?: string,
              public livrable?: string,
              public user?: UserModel,
              public dateRemise ?: Date,
              public modifications ?: Date[],
              public dateLimite ?: Date) {}
}
