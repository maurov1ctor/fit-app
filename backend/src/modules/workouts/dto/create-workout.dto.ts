import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { DifficultyLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class WorkoutExerciseDto {
  @IsUUID('4', { message: 'ID do exercício deve ser um UUID válido' })
  exerciseId: string;

  @IsInt({ message: 'Sets deve ser um número inteiro' })
  @Min(1, { message: 'Sets deve ser no mínimo 1' })
  sets: number;

  @IsOptional()
  @IsInt({ message: 'Reps deve ser um número inteiro' })
  @Min(1, { message: 'Reps deve ser no mínimo 1' })
  reps?: number;

  @IsOptional()
  @IsInt({ message: 'Duração deve ser um número inteiro' })
  @Min(1, { message: 'Duração deve ser no mínimo 1 segundo' })
  duration?: number;

  @IsOptional()
  weight?: number;

  @IsInt({ message: 'Ordem deve ser um número inteiro' })
  @Min(1, { message: 'Ordem deve ser no mínimo 1' })
  order: number;
}

export class CreateWorkoutDto {
  @IsString()
  @MinLength(3, { message: 'Título deve ter no mínimo 3 caracteres' })
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(DifficultyLevel, {
    message: `Nível de dificuldade deve ser um de: ${Object.values(
      DifficultyLevel,
    ).join(', ')}`,
  })
  difficulty: DifficultyLevel;

  @IsInt({ message: 'Duração deve ser um número inteiro' })
  @Min(1, { message: 'Duração deve ser no mínimo 1 minuto' })
  duration: number;

  @IsUUID('4', { message: 'ID do aluno deve ser um UUID válido' })
  studentId: string;

  @IsUUID('4', { message: 'ID do treinador deve ser um UUID válido' })
  trainerId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  @ArrayMinSize(1, {
    message: 'Deve haver no mínimo 1 exercício no workout',
  })
  exercises: WorkoutExerciseDto[];
}
