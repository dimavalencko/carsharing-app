import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from '@/infrastructure/controllers/auth.controller';
import { AuthFacadeService } from '@/infrastructure/services/auth-facade.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthFacadeService],
})
export class AuthModule {}