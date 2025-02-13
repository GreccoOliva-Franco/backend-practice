import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/config-module.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from './configs/jwt-module.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    JwtModule.registerAsync(jwtModuleAsyncOptions),

    AuthModule,
  ],
})
export class AppModule {}
