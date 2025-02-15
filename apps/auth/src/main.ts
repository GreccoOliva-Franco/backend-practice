import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const dir = process.cwd();
  app.useStaticAssets(path.join(dir, 'apps/auth/public'));
  app.setBaseViewsDir(path.join(dir, 'apps/auth/views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>('APP_PORT');
  await app.listen(port);
}
bootstrap();
