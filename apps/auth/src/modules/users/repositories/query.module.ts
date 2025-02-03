import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { UsersQueryRepository } from './query.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersQueryRepository],
  exports: [UsersQueryRepository, TypeOrmModule.forFeature([User])],
})
export class UsersQueryModule {}
