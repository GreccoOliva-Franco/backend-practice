import { Module } from '@nestjs/common';
import { GetUsersService } from './get-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [GetUsersService],
  exports: [GetUsersService],
})
export class GetUsersModule {}
