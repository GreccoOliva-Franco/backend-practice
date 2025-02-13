import { Module } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../queue.types';

@Module({
  imports: [BullModule.registerQueue({ name: QueueName.EMAIL })],
  providers: [EmailQueueService],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
