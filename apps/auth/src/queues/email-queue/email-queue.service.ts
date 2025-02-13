import { Injectable } from '@nestjs/common';
import { EmailDto } from '@apps/auth/emails/email.type';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '@apps/auth/queues/queue.types';
import { Queue } from 'bullmq';

@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue(QueueName.EMAIL) private readonly queueService: Queue,
  ) {}

  public async add(emailDto: EmailDto): Promise<void> {
    try {
      await this.queueService.add('send', emailDto);
    } catch {
      await this.trackFailure(emailDto);
    }
  }

  private async trackFailure(emailDto: EmailDto): Promise<void> {
    console.log(
      `Failed to queue email (${emailDto.emailId}) to user (${emailDto.userId})`,
    );
  }
}
