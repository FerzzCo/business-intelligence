import { NestFactory } from '@nestjs/core';
import { TicketingModule } from './ticketing.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(TicketingModule);
  // ─────────────────────────────────────────────────────────────────
  
    // ─────────────────────────────────────────────────────────────────
    const config = new DocumentBuilder()
      .setTitle('Time Tracking API')
      .setDescription('API documentation for the Time Tracking application')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    // ─────────────────────────────────────────────────────────────────
  
    // ─────────────────────────────────────────────────────────────────
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization',
      credentials: true,
    });
    // ─────────────────────────────────────────────────────────────────
  
    // ─────────────────────────────────────────────────────────────────
  await app.listen(process.env.port ?? 3010);
}
bootstrap();
