import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe, ValidationPipe, UsePipes, UseGuards, Request } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true,
  transform: true 
}))
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  // POST /quizzes - create a quiz for a lesson
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(
      createQuizDto.lessonId, 
      createQuizDto.title, 
      createQuizDto.questions
    );
  }

  // GET /quizzes/:id - get a quiz by quiz ID
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.findOne(id);
  }

  // PATCH /quizzes/:id - update a quiz
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  // DELETE /quizzes/:id - delete a quiz
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.remove(id);
  }

  // POST /quizzes/:id/submit - submit quiz answers and get results
  @Post(':id/submit')
  async submitQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() submitQuizDto: SubmitQuizDto,
    @Request() req
  ) {
    const userId = req.user.userId;
    return this.quizzesService.submitQuiz(id, submitQuizDto, userId);
  }

  // GET /quizzes/:id/attempts - get user's quiz attempts (for progress tracking)
  @Get(':id/attempts')
  async getUserAttempts(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.quizzesService.getUserAttempts(id, userId);
  }
}
