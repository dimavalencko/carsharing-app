import { errorResponseInterceptor } from './error-response';

export const responseInterceptors = [errorResponseInterceptor];
