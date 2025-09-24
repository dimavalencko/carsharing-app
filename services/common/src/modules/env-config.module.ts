import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigService } from '../config/config.service';

@Module({})
export class EnvConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: EnvConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            '.env',
            `.env.${process.env.NODE_ENV || 'development'}`,
            '.env.local',
          ],
        }),
      ],
      providers: [EnvConfigService],
      exports: [EnvConfigService],
    };
  }
}