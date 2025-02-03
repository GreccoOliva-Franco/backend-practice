import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './modules/configs/config-module.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from './modules/auth/jwt.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './modules/configs/typeorm-config.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    JwtModule.registerAsync(jwtModuleAsyncOptions),

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
