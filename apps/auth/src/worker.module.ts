import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/config-module.config';
import { queueAsyncConfiguration } from './queues/queue.config';
import { EmailQueueWorkerModule } from './queues/email-queue/email-queue.worker.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    BullModule.forRootAsync(queueAsyncConfiguration),

    EmailQueueWorkerModule,
  ],
})
export class WorkerModule {}
