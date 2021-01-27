import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function configure(
  app: INestApplication,
  ): void {
  const options = new DocumentBuilder()
    .setTitle('Lokalne dobrodziejstwa')
    .setDescription('API descriptions')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
