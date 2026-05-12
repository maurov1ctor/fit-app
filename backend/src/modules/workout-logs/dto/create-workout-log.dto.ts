import {
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseLogDto {
  @IsUUID('4', { message: 'ID do exercício deve ser um UUID válido' })
  exerciseId: string;

  @IsOptional()
  setsCompleted?: number;

  @IsOptional()
  repsCompleted?: number;

  @IsOptional()
  weightUsed?: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutLogDto {
  @IsUUID('4', { message: 'ID do workout deve ser um UUID válido' })
  workoutId: string;

  @IsUUID('4', { message: 'ID do aluno deve ser um UUID válido' })
  studentId: string;

  @IsDateString()
  startedAt: Date;

  @IsOptional()
  @IsDateString()
  endedAt?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @ValidateNested({ each: true })
  @Type(() => ExerciseLogDto)
  @ArrayMinSize(0)
  exerciseLogs?: ExerciseLogDto[];
}
