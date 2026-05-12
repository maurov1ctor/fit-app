import { DifficultyLevel, WorkoutStatus } from '@prisma/client';

export class ExerciseInWorkoutDto {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  order: number;
}

export class WorkoutResponseDto {
  id: string;
  title: string;
  description?: string;
  difficulty: DifficultyLevel;
  duration: number;
  studentId: string;
  trainerId: string;
  status: WorkoutStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  exercises: ExerciseInWorkoutDto[];
  createdAt: Date;
  updatedAt: Date;
}
