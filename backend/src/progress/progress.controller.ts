import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Get user's progress across all lessons
  @Get()
  async getUserProgress(@Request() req) {
    const userId = req.user.userId;
    return this.progressService.getUserProgress(userId);
  }

  // Get overall learning statistics
  @Get('stats/overview')
  async getUserStats(@Request() req) {
    const userId = req.user.userId;
    return this.progressService.getUserStats(userId);
  }

  // Get quiz progress for user
  @Get('quizzes')
  async getQuizProgress(@Request() req) {
    const userId = req.user.userId;
    return this.progressService.getQuizProgress(userId);
  }

  // Get comprehensive progress (lessons + quizzes)
  @Get('comprehensive')
  async getComprehensiveProgress(@Request() req) {
    const userId = req.user.userId;
    return this.progressService.getComprehensiveProgress(userId);
  }

  // Get progress for specific lesson
  @Get(':lessonId')
  async getLessonProgress(@Request() req, @Param('lessonId') lessonId: string) {
    const userId = req.user.userId;
    return this.progressService.getLessonProgress(userId, parseInt(lessonId));
  }

  // Mark lesson as completed
  @Post(':lessonId/complete')
  async markLessonCompleted(@Request() req, @Param('lessonId') lessonId: string) {
    const userId = req.user.userId;
    console.log('User ID from JWT:', userId, 'Type:', typeof userId);
    console.log('Lesson ID:', lessonId, 'Type:', typeof lessonId);
    
    if (!userId || isNaN(userId)) {
      throw new Error('Invalid user ID from JWT token');
    }
    
    return this.progressService.markLessonCompleted(Number(userId), parseInt(lessonId));
  }
}
