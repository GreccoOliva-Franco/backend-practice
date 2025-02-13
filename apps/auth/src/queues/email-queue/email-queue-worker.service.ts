import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueName } from '@apps/auth/queues/queue.types';
import { EmailProviderService } from './email-provider.service';
import { EmailDto } from '@apps/auth/emails/email.type';

@Processor(QueueName.EMAIL, { concurrency: 1 })
export class EmailQueueWorker extends WorkerHost {
  constructor(private readonly mailer: EmailProviderService) {
    super();
  }

  async process(job: Job<EmailDto>): Promise<void> {
    this.mailer.send(job.data);
  }
}
