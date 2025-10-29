import { Injectable } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
// Явные типы для импортированных функций (библиотека уже типизирована, но уточняем для линтера)
type BcryptHashFn = (
  data: string | Buffer,
  saltOrRounds: string | number,
) => Promise<string>;
type BcryptCompareFn = (
  data: string | Buffer,
  encrypted: string,
) => Promise<boolean>;

const hashFn: BcryptHashFn = bcryptHash as BcryptHashFn;
const compareFn: BcryptCompareFn = bcryptCompare as BcryptCompareFn;
import { IPasswordHasher } from '@/domain/interfaces/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordHasherService implements IPasswordHasher {
  constructor(private readonly config: ConfigService) {}

  async hash(password: string): Promise<string> {
    const rounds = parseInt(this.config.get('BCRYPT_ROUNDS', '10'), 10);
    const hashed: string = await hashFn(password, rounds);
    return hashed;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const isMatch: boolean = await compareFn(plain, hash);
    return isMatch;
  }
}
