import { IsInt, IsString, IsArray, IsNotEmpty, MinLength, MaxLength, ValidateNested, ArrayMinSize, ArrayMaxSize, IsOptional, IsEnum, IsNumber, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  SHORT_ANSWER = 'SHORT_ANSWER'
}

export class QuizAnswerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  text: string;

  @IsNotEmpty()
  isCorrect: boolean;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  letter?: string; // A, B, C, D for multiple choice
}

export class QuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  text: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @ValidateIf((o) => o.type !== QuestionType.MULTIPLE_CHOICE)
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  correctAnswer?: string; // Required for TRUE_FALSE, FILL_IN_BLANK, SHORT_ANSWER

  @IsOptional()
  @IsNumber()
  points?: number;

  @ValidateIf((o) => o.type === QuestionType.MULTIPLE_CHOICE)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  @ArrayMinSize(2, { message: 'Multiple choice questions must have at least 2 answers' })
  @ArrayMaxSize(6, { message: 'Multiple choice questions can have at most 6 answers' })
  answers?: QuizAnswerDto[]; // Required only for MULTIPLE_CHOICE questions
}

export class CreateQuizDto {
  @IsInt()
  @IsNotEmpty()
  lessonId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  @ArrayMinSize(1, { message: 'Quiz must have at least 1 question' })
  @ArrayMaxSize(20, { message: 'Quiz can have at most 20 questions' })
  questions: QuizQuestionDto[];
}
