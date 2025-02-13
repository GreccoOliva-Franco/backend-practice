import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { HashModule } from '@lib/hash/hash.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [HashModule],
  providers: [CreateUserService, PrismaClient],
  exports: [CreateUserService],
})
export class CreateUserModule {}
