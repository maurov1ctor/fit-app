import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ExercisesRepository } from './exercises.repository';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
  ExerciseResponseDto,
} from './dto';
import { ExerciseCategory, DifficultyLevel } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private exercisesRepository: ExercisesRepository) {}

  async findById(id: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exercisesRepository.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercício com ID ${id} não encontrado`);
    }
    return this.mapToResponseDto(exercise);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ exercises: ExerciseResponseDto[]; total: number }> {
    const [exercises, total] = await Promise.all([
      this.exercisesRepository.findAll(skip, take),
      this.exercisesRepository.count(),
    ]);
    return {
      exercises: exercises.map((exercise) => this.mapToResponseDto(exercise)),
      total,
    };
  }

  async findByCategory(
    category: ExerciseCategory,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ exercises: ExerciseResponseDto[]; total: number }> {
    const [exercises, total] = await Promise.all([
      this.exercisesRepository.findByCategory(category, skip, take),
      this.exercisesRepository.countByCategory(category),
    ]);
    return {
      exercises: exercises.map((exercise) => this.mapToResponseDto(exercise)),
      total,
    };
  }

  async findByDifficulty(
    difficulty: DifficultyLevel,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ exercises: ExerciseResponseDto[]; total: number }> {
    const [exercises, total] = await Promise.all([
      this.exercisesRepository.findByDifficulty(difficulty, skip, take),
      this.exercisesRepository.count(),
    ]);
    return {
      exercises: exercises.map((exercise) => this.mapToResponseDto(exercise)),
      total,
    };
  }

  async create(createExerciseDto: CreateExerciseDto): Promise<ExerciseResponseDto> {
    const exercise = await this.exercisesRepository.create(createExerciseDto);
    return this.mapToResponseDto(exercise);
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exercisesRepository.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercício com ID ${id} não encontrado`);
    }

    const updatedExercise = await this.exercisesRepository.update(
      id,
      updateExerciseDto,
    );
    return this.mapToResponseDto(updatedExercise);
  }

  async delete(id: string): Promise<void> {
    const exercise = await this.exercisesRepository.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercício com ID ${id} não encontrado`);
    }

    await this.exercisesRepository.delete(id);
  }

  private mapToResponseDto(exercise: any): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      difficulty: exercise.difficulty,
      imageUrl: exercise.imageUrl,
      videoUrl: exercise.videoUrl,
      instructions: exercise.instructions,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
