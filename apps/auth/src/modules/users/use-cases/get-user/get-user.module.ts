import { Module } from '@nestjs/common';
import { GetUserService } from './get-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [GetUserService],
  exports: [GetUserService],
})
export class GetUserModule {}
