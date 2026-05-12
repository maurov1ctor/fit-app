export class ExerciseLogResponseDto {
  id: string;
  workoutLogId: string;
  exerciseId: string;
  setsCompleted?: number;
  repsCompleted?: number;
  weightUsed?: number;
  duration?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkoutLogResponseDto {
  id: string;
  workoutId: string;
  studentId: string;
  startedAt: Date;
  endedAt?: Date;
  notes?: string;
  completed: boolean;
  exerciseLogs: ExerciseLogResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
