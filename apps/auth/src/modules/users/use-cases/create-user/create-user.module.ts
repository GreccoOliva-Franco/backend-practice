import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { HashModule } from '@lib/hash/hash.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@apps/auth/modules/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashModule],
  providers: [CreateUserService],
  exports: [CreateUserService],
})
export class CreateUserModule {}
