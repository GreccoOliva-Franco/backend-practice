import { Module } from '@nestjs/common';
import { VerifyEmailController } from './verify-email.controller';
import { VerifyEmailService } from './verify-email.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [VerifyEmailController],
  providers: [VerifyEmailService, PrismaClient],
})
export class VerifyEmailModule {}
