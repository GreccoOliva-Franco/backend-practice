import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from 'apps/shared/environments';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>('APP_PORT');
  const environment = configService.get<string>('APP_ENV');
  await app.listen(port, () => {
    const isProduction = environment === ENVIRONMENT.PRODUCTION;
    if (!isProduction) {
      Logger.warn(`App running on port: ${port}`);
    }
  });
}
bootstrap();
