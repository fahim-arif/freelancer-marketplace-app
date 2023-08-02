import { AxiosError, AxiosResponse, Method } from 'axios';
import { handleApiError } from 'utils/errorHandler';
import authApi from './apiService';

export async function authorizedGet<T>(url: string): Promise<T> {
  return await request('GET', url);
}

export async function authorizedPost<T>(url: string, body: object): Promise<T> {
  return await request('POST', url, body);
}

export async function authorizedPut<T>(url: string, body: object): Promise<T> {
  return await request('PUT', url, body);
}

export async function authorizedPatch<T>(url: string, body: object): Promise<T> {
  return await request('PATCH', url, body);
}

export async function authorizedDeleteWithOptions<T>(url: string, body: object): Promise<T> {
  return await request('DELETE', url, body);
}

export async function authorizedDelete(url: string): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    authApi
      .delete(url)
      .then(() => {
        resolve(true);
      })
      .catch((err: AxiosError) => {
        handleApiError(err);
        reject({ message: err.message, status: err.response?.status });
      });
  });
}

const request = async <T>(method: Method, url: string, data?: object): Promise<T> => {
  const requestSettings = {
    url,
    method,
    data,
  };
  return await new Promise<T>((resolve, reject) => {
    authApi
      .request(requestSettings)
      .then((res: AxiosResponse<T, any>) => {
        resolve(res.data);
      })
      .catch((err: AxiosError) => {
        handleApiError(err);
        reject({ message: err.message, status: err.response?.status });
      });
  });
};
