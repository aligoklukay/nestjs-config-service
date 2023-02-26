import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigService2 } from './config2.service';
import { ConfigService3 } from './config3.service';

@Module({
  providers: [ConfigService, ConfigService2, ConfigService3],
  exports: [ConfigService, ConfigService2, ConfigService3],
})
export class ConfigModule {}
