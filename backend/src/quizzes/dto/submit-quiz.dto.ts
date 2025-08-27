import { IsInt, IsString, IsArray, IsNotEmpty, ValidateNested, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizAnswerSubmissionDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  userAnswer: string;
}

export class SubmitQuizDto {
  @IsInt()
  @IsNotEmpty()
  quizId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerSubmissionDto)
  @ArrayMinSize(1, { message: 'Must answer at least 1 question' })
  answers: QuizAnswerSubmissionDto[];
}
