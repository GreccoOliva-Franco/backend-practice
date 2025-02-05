import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ENVIRONMENT } from '@apps/shared/environments';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const environment = this.configService.get<string>('APP_ENV');

    switch (environment) {
      case ENVIRONMENT.PRODUCTION:
      case ENVIRONMENT.DEVELOPMENT: {
        return this.getConfigurationsFromEnvFile();
      }
      case ENVIRONMENT.CI: {
        return this.getCiConfigurations();
      }
      case ENVIRONMENT.LOCAL: {
        return this.getLocalConfigurations();
      }
      default: {
        throw new Error('APP_ENV environment variable not set');
      }
    }
  }

  private getLocalConfigurations(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: './apps/auth/src/infrastructure/database/database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    };
  }

  private getCiConfigurations(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
    };
  }

  private getConfigurationsFromEnvFile(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'mysql' | 'postgres'>('DATABASE_PROVIDER'),
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT', { infer: true }),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useClass: TypeOrmConfigService,
};
