import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(10)
  content: string; // Markdown content or path
}
