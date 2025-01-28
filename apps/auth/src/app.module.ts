import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './modules/configs/environment';

@Module({
    ConfigModule.forRoot(configModuleOptions),
  controllers: [],
  providers: [],
})
export class AppModule {}
