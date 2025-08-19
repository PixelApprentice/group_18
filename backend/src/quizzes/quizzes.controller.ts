import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  // POST /quizzes - create a quiz for a lesson
  @Post()
  async create(@Body() body: any) {
    return this.quizzesService.create(body.lessonId, body.title, body.questions);
  }

  // GET /quizzes/:id - get a quiz by quiz ID
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.findOne(id);
  }

  // PATCH /quizzes/:id - update a quiz
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.quizzesService.update(id, body);
  }

  // DELETE /quizzes/:id - delete a quiz
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.remove(id);
  }
}
