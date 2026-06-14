import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';

// Базовые настройки
const httpConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Инстанс
export const defaultHttpClient: AxiosInstance = axios.create(httpConfig);

// Интерсепторы
setupInterceptors(defaultHttpClient);

export default defaultHttpClient;
