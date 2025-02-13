import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName } from '../queue.types';
import { EmailQueueWorker } from './email-queue-worker.service';
import { EmailProviderService } from './email-provider.service';
import { PrismaClient } from '@prisma/client';
import { WelcomeEmail } from '@apps/auth/emails/instances/welcome.email';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@apps/auth/configs/jwt-module.config';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.EMAIL }),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
  ],
  providers: [
    EmailQueueWorker,
    EmailProviderService,
    PrismaClient,

    // List of emails builders
    WelcomeEmail,
  ],
})
export class EmailQueueWorkerModule {}
