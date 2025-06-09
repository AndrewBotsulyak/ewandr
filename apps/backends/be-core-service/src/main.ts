import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {AppModule} from "./app/app.module";
import { AllExceptionsFilter } from './app/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('ums');

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:63342'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля
      forbidNonWhitelisted: true, // выбрасывает ошибку при лишних полях
      transform: true, // automatically transform payloads and params to be objects typed according to their DTO classes
    }),
  );

  // Настройка Swagger
  const options = new DocumentBuilder()
    .setTitle('My App API')
    .setDescription('API для моего приложения')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document); // Доступ к Swagger по /docs

  app.useGlobalFilters(new AllExceptionsFilter());

  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), {
  //     excludeExtraneousValues: true,
  //   }),
  // );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
