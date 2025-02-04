import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { UsersMutateModule } from '../../repositories/mutate.module';
import { HashModule } from '@lib/hash/hash.module';
import { UsersQueryModule } from '../../repositories/query.module';

@Module({
  imports: [UsersMutateModule, UsersQueryModule, HashModule],
  providers: [CreateUserService],
  exports: [CreateUserService],
})
export class CreateUserModule {}
