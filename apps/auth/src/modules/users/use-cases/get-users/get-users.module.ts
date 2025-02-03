import { Module } from '@nestjs/common';
import { GetUsersService } from './get-users.service';
import { UsersQueryModule } from '../../repositories/query.module';

@Module({
  imports: [UsersQueryModule],
  providers: [GetUsersService],
  exports: [GetUsersService],
})
export class GetUsersModule {}
