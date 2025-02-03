import { Module } from '@nestjs/common';
import { GetUserService } from './get-user.service';
import { UsersQueryModule } from '../../repositories/query.module';

@Module({
  imports: [UsersQueryModule],
  providers: [GetUserService],
  exports: [GetUserService],
})
export class GetUserModule {}
