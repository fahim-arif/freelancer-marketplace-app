import { handleApiError } from 'utils/errorHandler';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ITokenModel } from 'global/interfaces/tokenResponse';
import { IChangePasswordForm } from 'global/interfaces/changePassword';
import { authorizedPost, authorizedPut } from './baseApiService';
import { memoize } from 'utils/promises';
import authApi from 'services/apiService';
import { UserAuth } from 'contexts/AuthContext';

const resource = 'auth';
const passwordResource = 'password';

export async function getUserAuth(): Promise<UserAuth> {
  if (localStorage.getItem('accessToken') != null && localStorage.getItem('refreshToken') != null) {
    return await new Promise<UserAuth>((resolve, reject) => {
      authApi
        .get(`${process.env.REACT_APP_API_URL ?? ''}/${resource}/user`)
        .then((response: AxiosResponse<UserAuth>) => {
          resolve(response.data);
        })
        .catch(function (error) {
          handleApiError(error);
          reject();
        });
    });
  } else {
    throw 'Token not found';
  }
}

export async function changePassword(changePasswordForm: IChangePasswordForm): Promise<boolean> {
  return await authorizedPut(`${resource}/${passwordResource}`, changePasswordForm);
}

export async function loginWithResetToken(resetToken: string): Promise<ITokenModel> {
  const tokenModel = await authorizedPost<ITokenModel>(
    `${resource}/${passwordResource}/token?resetToken=${resetToken}`,
    {},
  );
  setLoggedIn(tokenModel);
  return tokenModel;
}

export async function resetPassword(formData: { email: string }): Promise<void> {
  return await authorizedPost(`${resource}/${passwordResource}/reset`, formData);
}

export async function login(email: string, password: string): Promise<ITokenModel> {
  const loginUrl = `${process.env.REACT_APP_API_URL ?? ''}/${resource}/token`;

  return await new Promise<ITokenModel>((resolve, reject) => {
    axios
      .post(loginUrl, {
        email,
        password,
      })
      .then((response: AxiosResponse<ITokenModel>) => {
        setLoggedIn(response.data);
        resolve(response.data);
      })
      .catch((err: AxiosError) => {
        handleApiError(err);
        reject();
      });
  });
}

function refreshTokenInternal(): Promise<ITokenModel> {
  return new Promise<ITokenModel>((resolve, reject) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const url = `${process.env.REACT_APP_API_URL ?? ''}/${resource}/refreshToken`;
    axios
      .post(url, {
        accessToken,
        refreshToken,
      })
      .then((response: AxiosResponse<ITokenModel>) => {
        const token = response.data;
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);
        resolve(token);
      })
      .catch((err: AxiosError) => {
        reject(err);
      });
  });
}

export const refreshToken = memoize(refreshTokenInternal);

function setLoggedIn(tokenModel: ITokenModel) {
  localStorage.setItem('accessToken', tokenModel.accessToken);
  localStorage.setItem('refreshToken', tokenModel.refreshToken);
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
