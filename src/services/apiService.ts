import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { refreshToken } from './authService';

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken != null && config.headers != null) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const onRequestError = async (error: AxiosError): Promise<never> => await Promise.reject(error);

const onResponse = (response: AxiosResponse): AxiosResponse => response;

const onResponseError = async (error: any): Promise<any> => {
  if (error.response !== undefined) {
    const originalRequest = error.config;
    // Access Token was expired
    if (error.response.status === 401 && originalRequest._retry !== false) {
      try {
        await refreshToken();
        return await authApi(originalRequest);
      } catch (_error) {
        return await Promise.reject(_error);
      }
    }
  }
  return await Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

const authApi: AxiosInstance = setupInterceptorsTo(
  axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
);

export default authApi;
