import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';

console.log('ImportMeta env: ', import.meta.env);
console.log('ImportMeta VITE_API_URL: ', import.meta.env.VITE_API_URL);

// Базовые настройки
const httpConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Инстанс
export const defaultHttpClient: AxiosInstance = axios.create(httpConfig);

// Интерсепторы
setupInterceptors(defaultHttpClient);

export default defaultHttpClient;
