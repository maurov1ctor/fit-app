import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { WorkoutLog } from '@prisma/client';

@Injectable()
export class WorkoutLogsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<WorkoutLog | null> {
    return this.prisma.workoutLog.findUnique({
      where: { id },
      include: {
        exerciseLogs: true,
        workout: {
          include: {
            exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
          },
        },
      },
    });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<WorkoutLog[]> {
    return this.prisma.workoutLog.findMany({
      skip,
      take,
      include: {
        exerciseLogs: true,
        workout: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findByWorkoutId(
    workoutId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<WorkoutLog[]> {
    return this.prisma.workoutLog.findMany({
      where: { workoutId },
      skip,
      take,
      include: {
        exerciseLogs: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findByStudentId(
    studentId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<WorkoutLog[]> {
    return this.prisma.workoutLog.findMany({
      where: { studentId },
      skip,
      take,
      include: {
        workout: true,
        exerciseLogs: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async create(data: {
    workoutId: string;
    studentId: string;
    startedAt: Date;
    endedAt?: Date;
    notes?: string;
  }): Promise<WorkoutLog> {
    return this.prisma.workoutLog.create({
      data,
      include: {
        exerciseLogs: true,
        workout: true,
      },
    });
  }

  async addExerciseLog(data: {
    workoutLogId: string;
    exerciseId: string;
    setsCompleted?: number;
    repsCompleted?: number;
    weightUsed?: number;
    duration?: number;
    notes?: string;
  }): Promise<void> {
    await this.prisma.exerciseLog.create({ data });
  }

  async update(
    id: string,
    data: {
      endedAt?: Date;
      notes?: string;
      completed?: boolean;
    },
  ): Promise<WorkoutLog> {
    return this.prisma.workoutLog.update({
      where: { id },
      data,
      include: {
        exerciseLogs: true,
        workout: true,
      },
    });
  }

  async delete(id: string): Promise<WorkoutLog> {
    return this.prisma.workoutLog.delete({
      where: { id },
      include: {
        exerciseLogs: true,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.workoutLog.count();
  }

  async countByStudentId(studentId: string): Promise<number> {
    return this.prisma.workoutLog.count({ where: { studentId } });
  }

  async getAverageWorkoutDuration(studentId: string): Promise<number> {
    const result = await this.prisma.workoutLog.aggregate({
      where: { studentId, completed: true },
      _avg: {
        startedAt: true,
      },
    });
    return result._avg.startedAt
      ? new Date(result._avg.startedAt).getTime()
      : 0;
  }
}
