import { Module } from '@nestjs/common';
import { BookModule } from './modules/books/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './modules/configs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './modules/configs/environment';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),

    BookModule,
  ],
})
export class AppModule {}
