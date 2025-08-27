import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    // Global rate limiting: 100 requests per 60s per client
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    UsersModule,
    PrismaModule,
    AuthModule,
    LessonsModule,
    QuizzesModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply throttling guard globally (can be overridden per-route with @Throttle)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
