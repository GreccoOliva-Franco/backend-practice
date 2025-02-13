import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueName } from '@apps/auth/queues/queue.types';
import { EmailProviderService } from './email-provider.service';
import { EmailDto } from '@apps/auth/emails/email.type';
import { Injectable } from '@nestjs/common';

@Processor(QueueName.EMAIL, { concurrency: 1 })
@Injectable()
export class EmailQueueWorker extends WorkerHost {
  constructor(private readonly mailProvider: EmailProviderService) {
    super();
  }

  async process(job: Job<EmailDto>): Promise<void> {
    this.mailProvider.send(job.data);
  }
}
