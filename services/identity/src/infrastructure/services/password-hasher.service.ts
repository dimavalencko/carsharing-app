import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '@/domain/interfaces/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordHasherService implements IPasswordHasher {
  constructor(private readonly config: ConfigService) {}

  async hash(password: string): Promise<string> {
    const rounds = parseInt(this.config.get('BCRYPT_ROUNDS', '10'), 10);
    return bcrypt.hash(password, rounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}