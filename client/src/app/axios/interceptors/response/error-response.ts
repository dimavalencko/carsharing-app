import type { AxiosResponse, AxiosError } from 'axios';

export const errorResponseInterceptor = {
  onFulfilled: (response: AxiosResponse) => response,
  onRejected: (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('carsharing_user');
      window.location.href = '/login';
    }

    console.error('API Error', error.response?.data || error.message);

    return Promise.reject(error);
  },
};
