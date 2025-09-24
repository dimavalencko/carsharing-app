import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '@core/proxy/base.proxy';
import { ServiceNames, IdentityEndpoints } from '@carsharing/common';

@Injectable()
export class IdentityProxy extends BaseProxy {
  constructor(@Inject(ServiceNames.IDENTITY) client: ClientProxy) {
    super(client);
  }

  async getAllUsers() {
    try {
    const result = await this.sendRequest(IdentityEndpoints.USERS.GET_ALL, {});  
    return result;
    } 
    catch (error) {
      console.log(error)
    }
  }

  async getUserById(id: string) {
    return this.sendRequest(IdentityEndpoints.USERS.GET_ALL, { id });
  }

  // async createUser(userData: any) {
  //   return this.sendRequest('users_create', userData);
  // }

  // async updateUser(id: string, userData: any) {
  //   return this.sendRequest('users_update', { id, ...userData });
  // }

  // async deleteUser(id: string) {
  //   return this.sendRequest('users_delete', { id });
  // }

  // async login(credentials: any) {
  //   return this.sendRequest('auth_login', credentials);
  // }

  // async register(userData: any) {
  //   return this.sendRequest('auth_register', userData);
  // }

  // async healthCheck() {
  //   return this.sendRequest('health_check', {});
  // }
}