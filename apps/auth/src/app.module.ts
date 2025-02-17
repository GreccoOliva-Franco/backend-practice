import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/config-module.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from './configs/jwt-module.config';
import { BullModule } from '@nestjs/bullmq';
import { queueAsyncConfiguration } from './queues/queue.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    BullModule.forRootAsync(queueAsyncConfiguration),
    JwtModule.registerAsync(jwtModuleAsyncOptions),

    AuthModule,
  ],
})
export class AppModule {}
