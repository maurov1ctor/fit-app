import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Workout, WorkoutStatus } from '@prisma/client';

@Injectable()
export class WorkoutsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Workout | null> {
    return this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        student: true,
        trainer: true,
      },
    });
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
    filters?: { studentId?: string; trainerId?: string; status?: WorkoutStatus },
  ): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: filters,
      skip,
      take,
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        student: true,
        trainer: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findByStudentId(
    studentId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: { studentId },
      skip,
      take,
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        trainer: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findByTrainerId(
    trainerId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: { trainerId },
      skip,
      take,
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        student: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    difficulty: string;
    duration: number;
    studentId: string;
    trainerId: string;
    scheduledAt?: Date;
  }): Promise<Workout> {
    return this.prisma.workout.create({
      data,
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        student: true,
        trainer: true,
      },
    });
  }

  async addExercises(
    workoutId: string,
    exercises: Array<{
      exerciseId: string;
      sets: number;
      reps?: number;
      duration?: number;
      weight?: number;
      order: number;
    }>,
  ): Promise<void> {
    await this.prisma.workoutExercise.createMany({
      data: exercises.map((ex) => ({
        ...ex,
        workoutId,
      })),
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      difficulty?: string;
      duration?: number;
      status?: WorkoutStatus;
      scheduledAt?: Date;
      startedAt?: Date;
      completedAt?: Date;
    },
  ): Promise<Workout> {
    return this.prisma.workout.update({
      where: { id },
      data,
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        student: true,
        trainer: true,
      },
    });
  }

  async delete(id: string): Promise<Workout> {
    return this.prisma.workout.delete({
      where: { id },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
  }

  async count(filters?: {
    studentId?: string;
    trainerId?: string;
    status?: WorkoutStatus;
  }): Promise<number> {
    return this.prisma.workout.count({ where: filters });
  }
}
