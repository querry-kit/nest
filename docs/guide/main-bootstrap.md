---
description: 'Complete NestJS main.ts example for @querry-kit/nest.'
---

# NestJS main.ts

This bootstrap example mirrors the Books API example. It registers Query Kit's query parser, structured fields errors, and Swagger documentation.

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FieldsExceptionFilter, QueryTransformPipe } from '@querry-kit/nest';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new QueryTransformPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new FieldsExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Books API')
    .setDescription('Example API using @querry-kit/nest resource queries and fields projection.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
```

## Notes

- `QueryTransformPipe` normalizes query strings before DTO validation and service calls.
- `ValidationPipe` handles DTO validation and transformation.
- `FieldsExceptionFilter` serializes invalid `fields` query values as structured HTTP 400 responses.
- `SwaggerModule.createDocument` works with `ApiPaginatedResponse`, `ApiErrorResponses`, and the DTO metadata used by fields schema generation.
- `PORT` keeps the example easy to run when `3000` is already occupied.
