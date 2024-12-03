import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS and allow requests from the frontend (localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000',  // Allow requests from this frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true,  // Allow cookies and credentials
  });

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
