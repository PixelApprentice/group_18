import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, LessonsModule, QuizzesModule, ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
