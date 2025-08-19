import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  // Create a quiz with questions and answers
  async create(lessonId: number, title: string, questions: any[]) {
    return this.prisma.quiz.create({
      data: {
        lessonId,
        title,
        questions: {
          create: questions.map((q: any) => ({
            question: q.text,
            answers: {
              create: (q.answers || []).map((a: any) => ({
                answer: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          })),
        },
      },
      include: { questions: { include: { answers: true } } },
    });
  }

  // Get a quiz by quiz ID
  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { answers: true } } },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  // Get a quiz by lesson ID
  async findByLessonId(lessonId: number) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { lessonId },
      include: { questions: { include: { answers: true } } },
    });
    if (!quiz) throw new NotFoundException('Quiz not found for this lesson');
    return quiz;
  }

  // Update a quiz (title/questions/answers)
  async update(id: number, data: any) {
    // For simplicity, delete old questions/answers and recreate
    await this.prisma.quizQuestion.deleteMany({ where: { quizId: id } });
    return this.prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((q: any) => ({
            question: q.text,
            answers: {
              create: (q.answers || []).map((a: any) => ({
                answer: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          })),
        },
      },
      include: { questions: { include: { answers: true } } },
    });
  }

  // Delete a quiz
  async remove(id: number) {
    return this.prisma.quiz.delete({ where: { id } });
  }
}
