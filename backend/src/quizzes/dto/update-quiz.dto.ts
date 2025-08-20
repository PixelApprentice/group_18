import { IsOptional, IsInt, IsString, IsArray, IsNotEmpty, MinLength, MaxLength, ValidateNested, ArrayMinSize, ArrayMaxSize, IsEnum, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from './create-quiz.dto';

export class UpdateQuizAnswerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  text?: string;

  @IsOptional()
  @IsNotEmpty()
  isCorrect?: boolean;
}

export class UpdateQuizQuestionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  text?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @ValidateIf((o) => o.type && o.type !== QuestionType.MULTIPLE_CHOICE)
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  correctAnswer?: string;

  @IsOptional()
  @IsArray()
  @ValidateIf((o) => o.type && o.type === QuestionType.MULTIPLE_CHOICE)
  @ValidateNested({ each: true })
  @Type(() => UpdateQuizAnswerDto)
  @ArrayMinSize(2, { message: 'Multiple choice questions must have at least 2 answers' })
  @ArrayMaxSize(6, { message: 'Multiple choice questions can have at most 6 answers' })
  answers?: UpdateQuizAnswerDto[];
}

export class UpdateQuizDto {
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  lessonId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuizQuestionDto)
  @ArrayMinSize(1, { message: 'Quiz must have at least 1 question' })
  @ArrayMaxSize(20, { message: 'Quiz can have at most 20 questions' })
  questions?: UpdateQuizQuestionDto[];
}
