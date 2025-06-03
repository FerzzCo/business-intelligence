import { NestFactory } from '@nestjs/core';
import { TimeTrackingModule } from './time-tracking.module';

async function bootstrap() {
  const app = await NestFactory.create(TimeTrackingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
