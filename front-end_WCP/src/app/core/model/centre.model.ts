import {UserModel} from './user.model';

export class CentreModel {
  constructor(public idCentre?: string,
              public nom?: string,
              public cigle?: string,
              public idResp?: string,
              public resp?: UserModel) {}
              // nzid list dial ids responsable
              // o nzid hta number des membres li kitbedel kol mazedna un membre
}
