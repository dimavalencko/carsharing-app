import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '@core/proxy/base.proxy';
import { ServiceNames, IdentityEndpoints, CreateUserDto, LoginUserDto, RegisterUserDto } from '@carsharing/common';

@Injectable()
export class IdentityProxy extends BaseProxy {
  constructor(@Inject(ServiceNames.IDENTITY) client: ClientProxy) {
    super(client);
  }

  async getAllUsers() {
    return await this.sendRequest(IdentityEndpoints.USERS.GET_ALL, {});  
  }

  async getUserById(id: string) {
    return await this.sendRequest(IdentityEndpoints.USERS.GET_BY_ID, id);
  }

  async createUser(userData: CreateUserDto) {
    return await this.sendRequest(IdentityEndpoints.USERS.CREATE, userData);
  }

  async updateUser(id: string, userData: any) {
    return await this.sendRequest(IdentityEndpoints.USERS.UPDATE, { id, updateUserDto: userData });
  }

  async deleteUser(id: string) {
    return await this.sendRequest(IdentityEndpoints.USERS.DELETE, { id });
  }

  async login(data: LoginUserDto) {
    return this.sendRequest(IdentityEndpoints.AUTH.LOGIN, data);
  }

  async register(userData: RegisterUserDto) {
    return this.sendRequest(IdentityEndpoints.AUTH.REGISTER, userData);
  }

  // async healthCheck() {
  //   return this.sendRequest('health_check', {});
  // }
}