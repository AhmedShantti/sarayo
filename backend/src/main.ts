import 'reflect-metadata';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: false,
  });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global URL prefix; Swagger lives at /api/docs.
  app.setGlobalPrefix('api', { exclude: ['/'] });

  // Serve locally-uploaded files (MVP storage).
  app.useStaticAssets(join(process.cwd(), config.get('uploads.dest') ?? './uploads'), {
    prefix: '/uploads/',
  });

  // CORS — storefront + dashboard origins, credentials allowed.
  const allowedOrigins = [
    config.get<string>('frontendUrl'),
    config.get<string>('dashboardUrl'),
  ].filter((o): o is string => Boolean(o));
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Global validation.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters (order matters: specific Prisma filter before catch-all).
  app.useGlobalFilters(new AllExceptionsFilter(), new PrismaExceptionFilter());

  // Global response envelope.
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));

  // Swagger.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sarayo Alwadiya — Chips Store API')
    .setDescription('REST API for the Sarayo Alwadiya chips store (NestJS + Prisma + Paymob).')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth')
    .addTag('Users')
    .addTag('Admin · Users')
    .addTag('Products')
    .addTag('Admin · Products')
    .addTag('Categories')
    .addTag('Admin · Categories')
    .addTag('Cart')
    .addTag('Orders')
    .addTag('Admin · Orders')
    .addTag('Payments')
    .addTag('Uploads')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);
  logger.log(`🥔 Sarayo backend running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
