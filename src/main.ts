import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';

import * as CookieParser from 'cookie-parser';
import { configure } from './config.main';
import { HttpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(CookieParser('secret'));
  const configService = app.get<ConfigService>(ConfigService);
  configure(app);
  await app.listen(configService.get('PORT'));
}

bootstrap();
