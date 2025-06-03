import { NestFactory } from '@nestjs/core';
import { TicketingModule } from './ticketing.module';

async function bootstrap() {
  const app = await NestFactory.create(TicketingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
