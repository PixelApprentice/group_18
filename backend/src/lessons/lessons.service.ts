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
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: { id: true, title: true, content: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    // Normalize provided content path to avoid duplicated 'content' segments
    const normalizedContentFile = lesson.content.replace(/^[/\\]*content[/\\]*/i, '');

    // Candidate paths to support different run contexts (ts-node vs compiled dist)
    const candidatePaths = [
      // Project root content (when running from backend, project root is one level up)
      join(process.cwd(), '..', 'content', normalizedContentFile),
      // Project root content from dist/src/* (__dirname typically backend/dist/src/lessons)
      join(__dirname, '..', '..', '..', '..', 'content', normalizedContentFile),
      // backend/content (optional alternative location)
      join(process.cwd(), 'content', normalizedContentFile),
      // backend/dist/content (fallback when packaged)
      join(__dirname, '..', '..', '..', 'content', normalizedContentFile),
    ];

    let fileData: string | null = null;
    let triedPaths: string[] = [];
    for (const p of candidatePaths) {
      triedPaths.push(p);
      try {
        fileData = await fs.readFile(p, 'utf-8');
        break;
      } catch (err) {
        // continue trying next path
      }
    }

    if (fileData == null) {
      throw new NotFoundException(
        `Lesson content file not found. Tried: ${triedPaths.join(' | ')}`,
      );
    }

    return { id: lesson.id, title: lesson.title, content: fileData };
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
