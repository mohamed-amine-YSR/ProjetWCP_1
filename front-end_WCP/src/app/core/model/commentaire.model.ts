import {UserModel} from './user.model';
import {ReponseModel} from './reponse.model';

export class CommentaireModel {
  constructor(
    public IdCom?: string,
    public idUser?: string,
    public user?: UserModel,
    public dateCom?: Date,
    public comment?: string,
    public reponses?: ReponseModel[],
    public countResponses?: number
  ) {}
}
