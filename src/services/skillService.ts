import { ISkill, ISkillFilters, ISkillMerge } from 'global/interfaces/skill';
import { getQueryParams } from 'utils/url';
import { authorizedDelete, authorizedGet, authorizedPost, authorizedPut } from './baseApiService';

const resource = 'skills';

export async function createSkill(skill: ISkill): Promise<ISkill> {
  return await authorizedPost(resource, skill);
}

export async function updateSkill(skill: ISkill): Promise<ISkill> {
  return await authorizedPut(`${resource}/${skill.id}`, skill);
}

export function upsertSkill(skill: ISkill): Promise<ISkill> {
  return skill.id ? updateSkill(skill) : createSkill(skill);
}

export async function deleteSkill(skill: ISkill): Promise<boolean> {
  return await authorizedDelete(`${resource}/${skill.id}`);
}

export async function getSkills(filters: ISkillFilters | null): Promise<ISkill[]> {
  return await authorizedGet<ISkill[]>(`${resource}?${getQueryParams(filters)}`);
}

export async function mergeSkills(source: ISkill, target: ISkill): Promise<void> {
  const mergeRequest: ISkillMerge = {
    sourceSkillId: source.id ?? '',
    targetSkillId: target.id ?? '',
  };
  return await authorizedPost(`${resource}/merges`, mergeRequest);
}
