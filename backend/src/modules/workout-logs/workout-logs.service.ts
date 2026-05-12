import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WorkoutLogsRepository } from './workout-logs.repository';
import {
  CreateWorkoutLogDto,
  UpdateWorkoutLogDto,
  WorkoutLogResponseDto,
} from './dto';

@Injectable()
export class WorkoutLogsService {
  constructor(private workoutLogsRepository: WorkoutLogsRepository) {}

  async findById(id: string): Promise<WorkoutLogResponseDto> {
    const log = await this.workoutLogsRepository.findById(id);
    if (!log) {
      throw new NotFoundException(`Registro de workout com ID ${id} não encontrado`);
    }
    return this.mapToResponseDto(log);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ logs: WorkoutLogResponseDto[]; total: number }> {
    const [logs, total] = await Promise.all([
      this.workoutLogsRepository.findAll(skip, take),
      this.workoutLogsRepository.count(),
    ]);
    return {
      logs: logs.map((log) => this.mapToResponseDto(log)),
      total,
    };
  }

  async findByWorkoutId(
    workoutId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ logs: WorkoutLogResponseDto[]; total: number }> {
    const [logs, total] = await Promise.all([
      this.workoutLogsRepository.findByWorkoutId(workoutId, skip, take),
      this.workoutLogsRepository.count(),
    ]);
    return {
      logs: logs.map((log) => this.mapToResponseDto(log)),
      total,
    };
  }

  async findByStudentId(
    studentId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ logs: WorkoutLogResponseDto[]; total: number }> {
    const [logs, total] = await Promise.all([
      this.workoutLogsRepository.findByStudentId(studentId, skip, take),
      this.workoutLogsRepository.countByStudentId(studentId),
    ]);
    return {
      logs: logs.map((log) => this.mapToResponseDto(log)),
      total,
    };
  }

  async create(
    createWorkoutLogDto: CreateWorkoutLogDto,
  ): Promise<WorkoutLogResponseDto> {
    const { exerciseLogs, ...logData } = createWorkoutLogDto;

    // Criar o registro de workout
    const log = await this.workoutLogsRepository.create(logData);

    // Adicionar registros de exercícios se fornecidos
    if (exerciseLogs && exerciseLogs.length > 0) {
      for (const exerciseLog of exerciseLogs) {
        await this.workoutLogsRepository.addExerciseLog({
          workoutLogId: log.id,
          ...exerciseLog,
        });
      }
    }

    // Buscar e retornar o log completo
    return this.findById(log.id);
  }

  async addExerciseLog(
    workoutLogId: string,
    exerciseLogData: {
      exerciseId: string;
      setsCompleted?: number;
      repsCompleted?: number;
      weightUsed?: number;
      duration?: number;
      notes?: string;
    },
  ): Promise<WorkoutLogResponseDto> {
    const log = await this.workoutLogsRepository.findById(workoutLogId);
    if (!log) {
      throw new NotFoundException(
        `Registro de workout com ID ${workoutLogId} não encontrado`,
      );
    }

    await this.workoutLogsRepository.addExerciseLog({
      workoutLogId,
      ...exerciseLogData,
    });

    return this.findById(workoutLogId);
  }

  async completeWorkoutLog(
    id: string,
    notes?: string,
  ): Promise<WorkoutLogResponseDto> {
    const log = await this.workoutLogsRepository.findById(id);
    if (!log) {
      throw new NotFoundException(`Registro de workout com ID ${id} não encontrado`);
    }

    if (log.completed) {
      throw new BadRequestException('Este workout já foi completado');
    }

    const updatedLog = await this.workoutLogsRepository.update(id, {
      endedAt: new Date(),
      completed: true,
      notes,
    });

    return this.mapToResponseDto(updatedLog);
  }

  async update(
    id: string,
    updateWorkoutLogDto: UpdateWorkoutLogDto,
  ): Promise<WorkoutLogResponseDto> {
    const log = await this.workoutLogsRepository.findById(id);
    if (!log) {
      throw new NotFoundException(`Registro de workout com ID ${id} não encontrado`);
    }

    const updatedLog = await this.workoutLogsRepository.update(id, {
      endedAt: updateWorkoutLogDto.endedAt,
      notes: updateWorkoutLogDto.notes,
    });

    return this.mapToResponseDto(updatedLog);
  }

  async delete(id: string): Promise<void> {
    const log = await this.workoutLogsRepository.findById(id);
    if (!log) {
      throw new NotFoundException(`Registro de workout com ID ${id} não encontrado`);
    }

    await this.workoutLogsRepository.delete(id);
  }

  private mapToResponseDto(log: any): WorkoutLogResponseDto {
    return {
      id: log.id,
      workoutId: log.workoutId,
      studentId: log.studentId,
      startedAt: log.startedAt,
      endedAt: log.endedAt,
      notes: log.notes,
      completed: log.completed,
      exerciseLogs: log.exerciseLogs.map((el) => ({
        id: el.id,
        workoutLogId: el.workoutLogId,
        exerciseId: el.exerciseId,
        setsCompleted: el.setsCompleted,
        repsCompleted: el.repsCompleted,
        weightUsed: el.weightUsed,
        duration: el.duration,
        notes: el.notes,
        createdAt: el.createdAt,
        updatedAt: el.updatedAt,
      })),
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    };
  }
}
