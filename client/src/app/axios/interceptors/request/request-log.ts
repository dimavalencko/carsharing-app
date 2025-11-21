import type { InternalAxiosRequestConfig } from 'axios';

export const requestLogInterceptor = (config: InternalAxiosRequestConfig) => {
  console.log('Request address: ', config.url);
  return config;
};
