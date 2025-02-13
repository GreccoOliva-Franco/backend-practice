import { EmailQueueService } from '@apps/auth/queues/email-queue/email-queue.service';
import { EmailDto } from './email.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly emailQueueService: EmailQueueService) {}

  public async sendOne(emailDto: EmailDto): Promise<void> {
    await this.emailQueueService.add(emailDto);
  }

  public async sendMany(emailDtos: EmailDto[]): Promise<void> {
    await Promise.all(emailDtos.map((dto) => this.sendOne(dto)));
  }
}
