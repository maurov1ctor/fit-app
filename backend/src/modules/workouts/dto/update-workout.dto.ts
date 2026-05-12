import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDto } from './create-workout.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { WorkoutStatus } from '@prisma/client';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @IsOptional()
  @IsEnum(WorkoutStatus, {
    message: `Status deve ser um de: ${Object.values(WorkoutStatus).join(', ')}`,
  })
  status?: WorkoutStatus;
}
