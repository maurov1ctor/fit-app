import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WorkoutsRepository } from './workouts.repository';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutResponseDto } from './dto';
import { WorkoutStatus } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private workoutsRepository: WorkoutsRepository) {}

  async findById(id: string): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new NotFoundException(`Workout com ID ${id} não encontrado`);
    }
    return this.mapToResponseDto(workout);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
    filters?: { studentId?: string; trainerId?: string; status?: WorkoutStatus },
  ): Promise<{ workouts: WorkoutResponseDto[]; total: number }> {
    const [workouts, total] = await Promise.all([
      this.workoutsRepository.findAll(skip, take, filters),
      this.workoutsRepository.count(filters),
    ]);
    return {
      workouts: workouts.map((workout) => this.mapToResponseDto(workout)),
      total,
    };
  }

  async findByStudentId(
    studentId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ workouts: WorkoutResponseDto[]; total: number }> {
    const [workouts, total] = await Promise.all([
      this.workoutsRepository.findByStudentId(studentId, skip, take),
      this.workoutsRepository.count({ studentId }),
    ]);
    return {
      workouts: workouts.map((workout) => this.mapToResponseDto(workout)),
      total,
    };
  }

  async findByTrainerId(
    trainerId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ workouts: WorkoutResponseDto[]; total: number }> {
    const [workouts, total] = await Promise.all([
      this.workoutsRepository.findByTrainerId(trainerId, skip, take),
      this.workoutsRepository.count({ trainerId }),
    ]);
    return {
      workouts: workouts.map((workout) => this.mapToResponseDto(workout)),
      total,
    };
  }

  async create(createWorkoutDto: CreateWorkoutDto): Promise<WorkoutResponseDto> {
    const { exercises, ...workoutData } = createWorkoutDto;

    // Validar que não há exercícios duplicados
    const exerciseIds = new Set(exercises.map((e) => e.exerciseId));
    if (exerciseIds.size !== exercises.length) {
      throw new BadRequestException(
        'Não pode haver exercícios duplicados no workout',
      );
    }

    // Criar workout
    const workout = await this.workoutsRepository.create({
      ...workoutData,
      status: WorkoutStatus.SCHEDULED,
    });

    // Adicionar exercícios
    await this.workoutsRepository.addExercises(
      workout.id,
      exercises.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets,
        reps: e.reps,
        duration: e.duration,
        weight: e.weight,
        order: e.order,
      })),
    );

    // Buscar workout com exercícios
    return this.findById(workout.id);
  }

  async update(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new NotFoundException(`Workout com ID ${id} não encontrado`);
    }

    const updatedWorkout = await this.workoutsRepository.update(
      id,
      updateWorkoutDto,
    );
    return this.mapToResponseDto(updatedWorkout);
  }

  async startWorkout(id: string): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new NotFoundException(`Workout com ID ${id} não encontrado`);
    }

    if (workout.status !== WorkoutStatus.SCHEDULED) {
      throw new BadRequestException('Apenas workouts agendados podem ser iniciados');
    }

    const updatedWorkout = await this.workoutsRepository.update(id, {
      status: WorkoutStatus.IN_PROGRESS,
      startedAt: new Date(),
    });
    return this.mapToResponseDto(updatedWorkout);
  }

  async completeWorkout(id: string): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new NotFoundException(`Workout com ID ${id} não encontrado`);
    }

    if (workout.status !== WorkoutStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Apenas workouts em andamento podem ser completados',
      );
    }

    const updatedWorkout = await this.workoutsRepository.update(id, {
      status: WorkoutStatus.COMPLETED,
      completedAt: new Date(),
    });
    return this.mapToResponseDto(updatedWorkout);
  }

  async cancelWorkout(id: string): Promise<WorkoutResponseDto> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new NotFoundException(`Workout com ID ${id} não encontrado`);
    }

    const updatedWorkout = await this.workoutsRepository.update(id, {
      status: WorkoutStatus.CANCELLED,
    });
    return this.mapToResponseDto(updatedWorkout);
  }

  async delete(id: string): Promise<void> {
    const workout = await this.workoutsRepository.findById(id);
    if (!workout) {
      throw new NotFoundException(`Workout com ID ${id} não encontrado`);
    }

    await this.workoutsRepository.delete(id);
  }

  private mapToResponseDto(workout: any): WorkoutResponseDto {
    return {
      id: workout.id,
      title: workout.title,
      description: workout.description,
      difficulty: workout.difficulty,
      duration: workout.duration,
      studentId: workout.studentId,
      trainerId: workout.trainerId,
      status: workout.status,
      scheduledAt: workout.scheduledAt,
      startedAt: workout.startedAt,
      completedAt: workout.completedAt,
      exercises: workout.exercises.map((we) => ({
        exerciseId: we.exerciseId,
        sets: we.sets,
        reps: we.reps,
        duration: we.duration,
        weight: we.weight,
        order: we.order,
      })),
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
    };
  }
}
