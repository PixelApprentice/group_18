import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Get user's progress across all lessons
  async getUserProgress(userId: number) {
    return this.prisma.userProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        lessonId: 'asc',
      },
    });
  }

  // Get progress for specific lesson
  async getLessonProgress(userId: number, lessonId: number) {
    return this.prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  // Mark lesson as completed
  async markLessonCompleted(userId: number, lessonId: number) {
    console.log('ProgressService - userId:', userId, 'lessonId:', lessonId);
    
    // First check if the lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    
    if (!lesson) {
      throw new Error(`Lesson with ID ${lessonId} not found`);
    }
    
    return this.prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId,
        lessonId,
        completed: true,
      },
    });
  }

  // Get overall learning statistics
  async getUserStats(userId: number) {
    const totalLessons = await this.prisma.lesson.count();
    const completedLessons = await this.prisma.userProgress.count({
      where: {
        userId,
        completed: true,
      },
    });

    const totalQuizzes = await this.prisma.quiz.count();
    
    // Count unique quizzes completed (not total attempts)
    const completedQuizzes = await this.prisma.quizAttempt.groupBy({
      by: ['quizId'],
      where: {
        userId,
        completed: true,
      },
      _count: {
        quizId: true,
      },
    });
    
    const completedQuizzesCount = completedQuizzes.length;

    // Get all completed quiz attempts to calculate percentage average
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId,
        completed: true,
      },
      select: {
        score: true,
        maxScore: true,
      },
    });

    // Calculate average percentage score
    let averageScore = 0;
    if (quizAttempts.length > 0) {
      console.log('Quiz Attempts for average calculation:', quizAttempts);
      
      const totalPercentage = quizAttempts.reduce((sum, attempt) => {
        const percentage = (attempt.score / attempt.maxScore) * 100;
        console.log(`Attempt: ${attempt.score}/${attempt.maxScore} = ${percentage}%`);
        return sum + percentage;
      }, 0);
      
      console.log('Total Percentage Sum:', totalPercentage);
      console.log('Number of Attempts:', quizAttempts.length);
      
      averageScore = Math.round((totalPercentage / quizAttempts.length) * 100) / 100; // Round to 2 decimal places
      console.log('Final Average Score:', averageScore);
    }

    return {
      totalLessons,
      completedLessons,
      completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      totalQuizzes,
      completedQuizzes: completedQuizzesCount,
      averageScore: averageScore,
    };
  }

  // Initialize progress for new user (optional)
  async initializeUserProgress(userId: number) {
    const lessons = await this.prisma.lesson.findMany({
      select: { id: true },
    });

    const progressEntries = lessons.map(lesson => ({
      userId,
      lessonId: lesson.id,
      completed: false,
    }));

    return this.prisma.userProgress.createMany({
      data: progressEntries,
      skipDuplicates: true,
    });
  }

  // Get quiz progress for a user (best score per quiz)
  async getQuizProgress(userId: number) {
    // Get best attempt per quiz for the user
    const bestQuizAttempts = await this.prisma.quizAttempt.groupBy({
      by: ['quizId'],
      where: { userId },
      _max: {
        score: true,
      },
    });

    // Get detailed info for best attempts
    const quizProgress: any[] = [];
    for (const bestAttempt of bestQuizAttempts) {
      if (bestAttempt._max.score === null) continue;
      
      const attempt = await this.prisma.quizAttempt.findFirst({
        where: {
          userId,
          quizId: bestAttempt.quizId,
          score: bestAttempt._max.score,
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              lessonId: true,
              lesson: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { completedAt: 'desc' },
      });

      if (attempt) {
        quizProgress.push({
          id: attempt.id,
          quizId: attempt.quizId,
          quizTitle: attempt.quiz.title,
          lessonId: attempt.quiz.lessonId,
          lessonTitle: attempt.quiz.lesson.title,
          score: attempt.score,
          maxScore: attempt.maxScore,
          percentage: Math.round((attempt.score / attempt.maxScore) * 100),
          completedAt: attempt.completedAt,
          passed: (attempt.score / attempt.maxScore) >= 0.75,
          attempts: await this.prisma.quizAttempt.count({
            where: { userId, quizId: attempt.quizId },
          }),
        });
      }
    }

    return quizProgress.sort((a: any, b: any) => b.percentage - a.percentage);
  }

  // Get comprehensive progress (lessons + quizzes)
  async getComprehensiveProgress(userId: number) {
    const [lessonProgress, quizProgress] = await Promise.all([
      this.getUserProgress(userId),
      this.getQuizProgress(userId),
    ]);

    return {
      lessons: lessonProgress,
      quizzes: quizProgress,
      summary: {
        totalLessons: lessonProgress.length,
        completedLessons: lessonProgress.filter((p: any) => p.completed).length,
        totalQuizzes: quizProgress.length,
        passedQuizzes: quizProgress.filter((q: any) => q.passed).length,
        overallCompletion: this.calculateOverallCompletion(lessonProgress, quizProgress),
      },
    };
  }

  private calculateOverallCompletion(lessonProgress: any[], quizProgress: any[]) {
    const totalItems = lessonProgress.length + quizProgress.length;
    if (totalItems === 0) return 0;
    
    const completedItems = lessonProgress.filter((p: any) => p.completed).length + 
                          quizProgress.filter((q: any) => q.passed).length;
    
    return Math.round((completedItems / totalItems) * 100);
  }
}
