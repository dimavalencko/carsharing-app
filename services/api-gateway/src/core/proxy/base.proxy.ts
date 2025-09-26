import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseProxy {
  constructor(protected readonly client: ClientProxy) {}

  async sendRequest(pattern: string, data: any) {
    try {
      console.log('🔵 [BaseProxy] SENDING:');
      console.log('🔵 [BaseProxy] Pattern:', pattern);
      console.log('🔵 [BaseProxy] Data:', data);
      console.log('🔵 [BaseProxy] Data type:', typeof data);
      const response = await firstValueFrom(
        this.client.send(pattern, data)
      );
      console.log('🔵 [BaseProxy] RESPONSE:', response);
      return response;
    } 
    catch (error) {
      console.error(`Error in ${this.constructor.name}:`, error);
      throw error;
    }
  }
}