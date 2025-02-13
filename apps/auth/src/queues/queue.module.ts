import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { queueAsyncConfiguration } from './queue.config';
import { EmailQueueModule } from './email-queue/email-queue.module';

@Module({
  imports: [BullModule.forRootAsync(queueAsyncConfiguration), EmailQueueModule],
})
export class QueueModule {}
