import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  // Create a new lesson
  async create(createLessonDto: CreateLessonDto) {
    return this.prisma.lesson.create({ data: createLessonDto });
  }

  // Get all lessons
  async findAll() {
    return this.prisma.lesson.findMany();
  }

  // Get a lesson by id, reading markdown content from disk
  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    // Use __dirname for robust path resolution to project root content folder
    const markdownPath = join(__dirname, '..', '..', '..', 'content', lesson.content);
    lesson.content = await fs.readFile(markdownPath, 'utf-8');
    return lesson;
  }

  // Update a lesson by id
  async update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.prisma.lesson.update({ where: { id }, data: updateLessonDto });
  }

  // Delete a lesson by id
  async remove(id: number) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}
