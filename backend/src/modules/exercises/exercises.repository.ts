import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Exercise, ExerciseCategory, DifficultyLevel } from '@prisma/client';

@Injectable()
export class ExercisesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Exercise | null> {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async findByCategory(
    category: ExerciseCategory,
    skip: number = 0,
    take: number = 10,
  ): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: { category },
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async findByDifficulty(
    difficulty: DifficultyLevel,
    skip: number = 0,
    take: number = 10,
  ): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: { difficulty },
      skip,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    category: ExerciseCategory;
    difficulty: DifficultyLevel;
    imageUrl?: string;
    videoUrl?: string;
    instructions?: string;
  }): Promise<Exercise> {
    return this.prisma.exercise.create({ data });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: ExerciseCategory;
      difficulty?: DifficultyLevel;
      imageUrl?: string;
      videoUrl?: string;
      instructions?: string;
    },
  ): Promise<Exercise> {
    return this.prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Exercise> {
    return this.prisma.exercise.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.exercise.count();
  }

  async countByCategory(category: ExerciseCategory): Promise<number> {
    return this.prisma.exercise.count({ where: { category } });
  }
}
