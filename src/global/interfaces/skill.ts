import { IPagingFilter } from './ordering';

export interface ISkillFilters extends IPagingFilter {
  search?: string;
}

export interface ISkill {
  id?: string;
  value: string;
}

export interface ISkillMerge {
  sourceSkillId: string;
  targetSkillId: string;
}
