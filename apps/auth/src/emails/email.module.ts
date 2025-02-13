import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailQueueModule } from '@apps/auth/queues/email-queue/email-queue.module';

@Module({
  imports: [EmailQueueModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
