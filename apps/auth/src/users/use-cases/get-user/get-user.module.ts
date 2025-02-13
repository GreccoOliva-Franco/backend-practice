import { Module } from '@nestjs/common';
import { GetUserService } from './get-user.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [],
  providers: [GetUserService, PrismaClient],
  exports: [GetUserService],
})
export class GetUserModule {}
