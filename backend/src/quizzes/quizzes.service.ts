import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto, QuestionType } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

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
            type: q.type || QuestionType.MULTIPLE_CHOICE,
            correctAnswer: q.correctAnswer,
            points: q.points || 1,
            answers: {
              create: (q.answers || []).map((a: any) => ({
                answer: a.text,
                isCorrect: a.isCorrect,
                letter: a.letter,
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

  // Submit quiz answers and evaluate
  async submitQuiz(quizId: number, submitQuizDto: SubmitQuizDto) {
    const quiz = await this.findOne(quizId);
    let totalScore = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const results: any[] = [];

    for (const answer of submitQuizDto.answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      let isCorrect = false;
      let pointsEarned = 0;

      // Evaluate based on question type
      switch (question.type) {
        case QuestionType.MULTIPLE_CHOICE:
          const correctAnswer = question.answers.find(a => a.isCorrect);
          isCorrect = correctAnswer ? answer.userAnswer === correctAnswer.answer : false;
          break;
        
        case QuestionType.TRUE_FALSE:
          isCorrect = answer.userAnswer.toLowerCase() === (question.correctAnswer?.toLowerCase() || '');
          break;
        
        case QuestionType.FILL_IN_BLANK:
          isCorrect = answer.userAnswer.toLowerCase().trim() === (question.correctAnswer?.toLowerCase().trim() || '');
          break;
        
        case QuestionType.SHORT_ANSWER:
          // For short answer, we could implement fuzzy matching or exact match
          isCorrect = answer.userAnswer.toLowerCase().trim() === (question.correctAnswer?.toLowerCase().trim() || '');
          break;
      }

      if (isCorrect) {
        pointsEarned = question.points || 1;
        totalScore += pointsEarned;
      }

      results.push({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect,
        pointsEarned,
        correctAnswer: this.getCorrectAnswer(question),
      });
    }

    // Create quiz attempt record
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId: 1, // TODO: Get from JWT token
        quizId,
        score: totalScore,
        maxScore,
        completed: true,
        completedAt: new Date(),
        answers: {
          create: results.map((r: any) => ({
            questionId: r.questionId,
            userAnswer: r.userAnswer,
            isCorrect: r.isCorrect,
            pointsEarned: r.pointsEarned,
          })),
        },
      },
      include: { answers: true },
    });

    return {
      attemptId: attempt.id,
      score: totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      results,
      completedAt: attempt.completedAt,
    };
  }

  // Get correct answer for a question (without revealing it to user)
  private getCorrectAnswer(question: any) {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        const correct = question.answers.find((a: any) => a.isCorrect);
        return correct ? correct.answer : null;
      case QuestionType.TRUE_FALSE:
      case QuestionType.FILL_IN_BLANK:
      case QuestionType.SHORT_ANSWER:
        return question.correctAnswer;
      default:
        return null;
    }
  }

  // Get user's quiz attempts
  async getUserAttempts(quizId: number) {
    return this.prisma.quizAttempt.findMany({
      where: { quizId },
      include: { answers: true },
      orderBy: { startedAt: 'desc' },
    });
  }
}
