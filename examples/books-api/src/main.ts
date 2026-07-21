import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FieldsExceptionFilter, QueryTransformPipe } from '@querry-kit/nest';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new QueryTransformPipe());
  app.useGlobalFilters(new FieldsExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Query Kit Nest Books API')
    .setDescription(
      'In-memory example for @querry-kit/nest resource queries, fields projection, CASL policies, and OpenAPI helpers.',
    )
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
