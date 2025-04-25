import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Use cookie-parser middleware globally
  app.use(cookieParser());
  // Enable CORS for all origins and methods
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
