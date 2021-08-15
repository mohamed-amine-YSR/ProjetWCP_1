import {SkillModel} from './skill.model';

export class DisciplineModel {
  constructor(public id?: string,
              public name?: string,
              public skills?: SkillModel[]) {}
}
