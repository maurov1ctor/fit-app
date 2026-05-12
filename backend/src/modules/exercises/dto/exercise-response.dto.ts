import { ExerciseCategory, DifficultyLevel } from '@prisma/client';

export class ExerciseResponseDto {
  id: string;
  name: string;
  description?: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  videoUrl?: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}
