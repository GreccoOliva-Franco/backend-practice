import { Module } from '@nestjs/common';
import { BookModule } from './modules/books/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './modules/configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './modules/configs/config-module.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),

    BookModule,
  ],
})
export class AppModule {}
