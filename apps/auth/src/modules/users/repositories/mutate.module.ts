import { User } from '../entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersMutateRepository } from './mutate.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersMutateRepository],
  exports: [UsersMutateRepository, TypeOrmModule.forFeature([User])],
})
export class UsersMutateModule {}
