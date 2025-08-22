import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsEnum } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_\- ]+$/, { message: 'Name can only contain letters, numbers, spaces, underscores, and hyphens.' })
  name: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character.'
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
