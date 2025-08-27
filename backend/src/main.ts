import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set secure HTTP headers to mitigate common web risks (XSS, clickjacking, MIME sniffing)
  app.use(helmet({
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' },
    contentSecurityPolicy: false,
  }));

  // Only allow requests from known frontend origins (adjust via env FRONTEND_ORIGIN)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
      process.env.FRONTEND_ORIGIN as string,
    ].filter(Boolean) as string[],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
