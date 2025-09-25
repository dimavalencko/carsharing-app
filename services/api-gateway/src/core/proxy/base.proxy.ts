import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseProxy {
  constructor(protected readonly client: ClientProxy) {}

  async sendRequest(pattern: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.client.send('id', data)
      );
      return response;
    } 
    catch (error) {
      console.error(`Error in ${this.constructor.name}:`, error);
      throw error;
    }
  }
}