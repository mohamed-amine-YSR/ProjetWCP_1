import {UserModel} from './user.model';

export class ReponseModel {
  constructor(
    public IdRep?: string,
    public user?: UserModel,
    public dateRep?: Date,
    public response?: string
  ) {}
}
