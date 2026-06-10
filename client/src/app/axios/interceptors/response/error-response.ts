import type { AxiosResponse, AxiosError } from 'axios';

const AUTH_ENDPOINTS = ['/identity/auth/login', '/identity/auth/register', '/identity/auth/refresh'];

export const errorResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => response,
  onRejected: (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthEndpoint = AUTH_ENDPOINTS.some(e => url.includes(e));

      if (!isAuthEndpoint) {
        localStorage.removeItem('carsharing_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
};
