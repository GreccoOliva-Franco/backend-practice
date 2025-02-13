import {
  BullRootModuleOptions,
  SharedBullAsyncConfiguration,
} from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
class BullMqConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  public createSharedConfiguration():
    | BullRootModuleOptions
    | Promise<BullRootModuleOptions> {
    const queuePort = this.configService.get<number>('QUEUE_PORT', {
      infer: true,
    });

    return {
      connection: { port: queuePort },
    };
  }
}

export const queueAsyncConfiguration: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  useClass: BullMqConfigurationService,
};
