import {
  IVettingChange,
  IVettingChangeView,
  IFrontUser,
  IFrontUserBase,
  IFrontUserFilters,
  IUserFilters,
  IUser,
  IEditableUser,
} from 'global/interfaces/user';
import { getQueryParams } from 'utils/url';
import { authorizedDelete, authorizedGet, authorizedPost, authorizedPut } from './baseApiService';
import { ISignUpForm } from 'global/interfaces/signup';
import { login } from './authService';

const coreResource = 'core/users';
const frontResource = 'front/users';
const vettingChangesResource = 'vettingChanges';

export async function createUser(userForm: ISignUpForm): Promise<void> {
  await authorizedPost(`${coreResource}`, {
    firstName: userForm.firstName,
    lastName: userForm.lastName,
    city: userForm.city,
    country: userForm.country,
    email: userForm.email,
    password: userForm.password,
    confirmationCode: userForm.confirmationCode,
  });
  await login(userForm.email, userForm.password);
}

export async function upsertUser(user: IEditableUser): Promise<IUser> {
  return await authorizedPut(`${coreResource}/current`, user);
}

export async function getUser(userId = 'current'): Promise<IUser> {
  return await authorizedGet<IUser>(`${coreResource}/${userId}`);
}

export async function getUsers(filters: IUserFilters | null): Promise<IUser[]> {
  return await authorizedGet<IUser[]>(`${coreResource}?${getQueryParams(filters)}`);
}

export async function deleteUser(userId = 'current'): Promise<boolean> {
  return await authorizedDelete(`${coreResource}/${userId}`);
}

export async function getFrontUsers(filters: IFrontUserFilters | null): Promise<IFrontUserBase[]> {
  const coreFilters = filters as IUserFilters;
  return await authorizedGet<IFrontUserBase[]>(`${frontResource}?${getQueryParams(coreFilters)}`);
}

export async function getFrontUser(userId: string): Promise<IFrontUser> {
  return await authorizedGet<IFrontUser>(`${frontResource}/${userId}`);
}

export async function updateUserViews(userIds: string[]): Promise<boolean> {
  return await authorizedPost<boolean>(`core/stats/userViews`, userIds);
}

export async function createUserVettingView(userId: string): Promise<boolean> {
  return await authorizedPost<boolean>(`core/stats/users/${userId}/vettingViews`, {});
}

export async function createVettingChange(userId: string, change: IVettingChange): Promise<IVettingChangeView> {
  return await authorizedPost(`${coreResource}/${userId}/${vettingChangesResource}`, change);
}

export async function getVettingChanges(userId: string): Promise<IVettingChangeView[]> {
  return await authorizedGet<IVettingChangeView[]>(`${coreResource}/${userId}/${vettingChangesResource}`);
}

export async function verifyEmail(email: string): Promise<void> {
  return await authorizedPost(`${coreResource}/current/verifications/email`, {
    email,
  });
}

export async function validateEmailCode(email: string, code: number): Promise<boolean> {
  return await authorizedPost<boolean>(`${coreResource}/validations/emailcode`, {
    email,
    code,
  });
}
