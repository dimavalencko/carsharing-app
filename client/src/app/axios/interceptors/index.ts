import type { AxiosInstance } from 'axios';
import { requestInterceptors } from './request';
import { createErrorInterceptor } from './response/error-response';

export const setupInterceptors = (httpClient: AxiosInstance) => {
  requestInterceptors.forEach(interceptor => {
    httpClient.interceptors.request.use(interceptor);
  });

  const errorInterceptor = createErrorInterceptor(httpClient);
  httpClient.interceptors.response.use(errorInterceptor.onFulfilled, errorInterceptor.onRejected);

  return httpClient;
};
