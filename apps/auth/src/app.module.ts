import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './modules/configs/config-module.config';
import { typeOrmModuleOptions } from './modules/configs/typeorm.config';

@Module({
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
  controllers: [],
  providers: [],
})
export class AppModule {}
