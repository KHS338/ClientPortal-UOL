import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://client-portal-uol.vercel.app',
      'https://client-portal-uol-git-master-khs338s-projects.vercel.app',
      'https://client-portal-to05smla6-khs338s-projects.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that are not in the DTO
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Transform payloads to DTO instances
  }));
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Server is running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
