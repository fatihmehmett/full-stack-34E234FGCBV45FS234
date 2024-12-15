import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // İzin verilen frontend URL'si
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // İzin verilen HTTP yöntemleri
    allowedHeaders: '*', // İzin verilen başlıklar
    credentials: true, // Çerez gönderimine izin ver
  });

  await app.listen(3000);
}
bootstrap();
