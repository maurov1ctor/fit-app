import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ExerciseCategory, DifficultyLevel } from '@prisma/client';

export class CreateExerciseDto {
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ExerciseCategory, {
    message: `Categoria deve ser um de: ${Object.values(ExerciseCategory).join(
      ', ',
    )}`,
  })
  category: ExerciseCategory;

  @IsEnum(DifficultyLevel, {
    message: `Nível de dificuldade deve ser um de: ${Object.values(
      DifficultyLevel,
    ).join(', ')}`,
  })
  difficulty: DifficultyLevel;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}
