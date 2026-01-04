import { NestFactory } from '@nestjs/core';
import { MessageAppModule } from './message-app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    MessageAppModule,
    {
      logger: new ConsoleLogger({
        json: true,
        colors: true,
      }),
    },
  );

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1/message');
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
  });

  app.use(cookieParser());
  app.enableShutdownHooks();

  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('PORT') || 8888;
  logger.log(`Starting Message Service on port ${port}...`);
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
