import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import {
  CreateWorkoutLogDto,
  UpdateWorkoutLogDto,
  WorkoutLogResponseDto,
  ExerciseLogDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('workout-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkoutLogsController {
  constructor(private workoutLogsService: WorkoutLogsService) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkoutLogResponseDto> {
    return this.workoutLogsService.findById(id);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ logs: WorkoutLogResponseDto[]; total: number }> {
    return this.workoutLogsService.findAll(skip, take);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async create(
    @Body() createWorkoutLogDto: CreateWorkoutLogDto,
  ): Promise<WorkoutLogResponseDto> {
    return this.workoutLogsService.create(createWorkoutLogDto);
  }

  @Post(':id/exercise-logs')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async addExerciseLog(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() exerciseLogDto: ExerciseLogDto,
  ): Promise<WorkoutLogResponseDto> {
    return this.workoutLogsService.addExerciseLog(id, exerciseLogDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWorkoutLogDto: UpdateWorkoutLogDto,
  ): Promise<WorkoutLogResponseDto> {
    return this.workoutLogsService.update(id, updateWorkoutLogDto);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async completeWorkoutLog(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data?: { notes?: string },
  ): Promise<WorkoutLogResponseDto> {
    return this.workoutLogsService.completeWorkoutLog(id, data?.notes);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.workoutLogsService.delete(id);
  }

  @Get('workout/:workoutId')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async findByWorkoutId(
    @Param('workoutId', new ParseUUIDPipe()) workoutId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ logs: WorkoutLogResponseDto[]; total: number }> {
    return this.workoutLogsService.findByWorkoutId(workoutId, skip, take);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async findByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ logs: WorkoutLogResponseDto[]; total: number }> {
    return this.workoutLogsService.findByStudentId(studentId, skip, take);
  }
}
