import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const AUTH_ENDPOINTS = ['/identity/auth/login', '/identity/auth/register', '/identity/auth/refresh'];
const AUTH_STORAGE_KEY = 'carsharing_user';

let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  failedQueue = [];
}

function clearAuthAndRedirect() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export function createErrorInterceptor(httpClient: AxiosInstance) {
  return {
    onFulfilled: (response: AxiosResponse) => response,
    onRejected: async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status !== 401 || !original) {
        return Promise.reject(error);
      }

      const url = original.url ?? '';
      if (AUTH_ENDPOINTS.some(e => url.includes(e))) {
        return Promise.reject(error);
      }

      if (original._retry) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => httpClient(original))
          .catch(err => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await httpClient.post('/identity/auth/refresh');
        processQueue(null);
        return httpClient(original);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  };
}
