export type ServiceHealthStatus = 'healthy' | 'unhealthy' | 'degraded';
export type ServiceDBHealthStatus = 'healthy' | 'unhealthy' | 'missing';

export declare interface ServiceHealth {
  service: string;
  timestamp: string;
  status: ServiceHealthStatus; 
  responseTime: number;
  dbHealth?: ServiceDBHealthStatus;
  errorMessage?: string; 
}