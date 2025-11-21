import type { AxiosInstance } from 'axios';
import { requestInterceptors } from './request';
import { responseInterceptors } from './response';

// регистрация интерсепторов
export const setupInterceptors = (httpClient: AxiosInstance) => {
  // Request интерсепторы
  requestInterceptors.forEach(interceptor => {
    httpClient.interceptors.request.use(interceptor);
  });

  // Response интерсепторы
  responseInterceptors.forEach(interceptor => {
    httpClient.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
  });

  return httpClient;
};
