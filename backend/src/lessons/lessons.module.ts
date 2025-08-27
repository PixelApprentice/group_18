import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { QuizzesModule } from '../quizzes/quizzes.module';

@Module({
  imports: [QuizzesModule],
  providers: [LessonsService],
  controllers: [LessonsController]
})
export class LessonsModule {}
