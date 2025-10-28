import { UserAggregate } from "@/domain/aggreagates/user";
import { UserMapper } from "@/infrastructure/persistence/typeorm";
import { CreateUserDto } from "@carsharing/common";

export class UsersManagementService {
  constructor(
    
  ) {

  }


  async createUser(userDto: CreateUserDto) {
    console.log('CreateUserDto: ', userDto);

    const domainUser = UserMapper.toDomain(userDto)

    const userAggregate = UserAggregate.create(createUserDTO)
  }
}