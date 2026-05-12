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
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole, WorkoutStatus } from '@prisma/client';

@Controller('workouts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkoutsController {
  constructor(private workoutsService: WorkoutsService) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkoutResponseDto> {
    return this.workoutsService.findById(id);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
    @Query('studentId') studentId?: string,
    @Query('trainerId') trainerId?: string,
    @Query('status') status?: WorkoutStatus,
  ): Promise<{ workouts: WorkoutResponseDto[]; total: number }> {
    return this.workoutsService.findAll(skip, take, {
      studentId,
      trainerId,
      status,
    });
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async create(@Body() createWorkoutDto: CreateWorkoutDto): Promise<WorkoutResponseDto> {
    return this.workoutsService.create(createWorkoutDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    return this.workoutsService.update(id, updateWorkoutDto);
  }

  @Patch(':id/start')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async startWorkout(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkoutResponseDto> {
    return this.workoutsService.startWorkout(id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async completeWorkout(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkoutResponseDto> {
    return this.workoutsService.completeWorkout(id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async cancelWorkout(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkoutResponseDto> {
    return this.workoutsService.cancelWorkout(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.workoutsService.delete(id);
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TRAINER, UserRole.STUDENT)
  async findByStudentId(
    @Param('studentId', new ParseUUIDPipe()) studentId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ workouts: WorkoutResponseDto[]; total: number }> {
    return this.workoutsService.findByStudentId(studentId, skip, take);
  }

  @Get('trainer/:trainerId')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async findByTrainerId(
    @Param('trainerId', new ParseUUIDPipe()) trainerId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ workouts: WorkoutResponseDto[]; total: number }> {
    return this.workoutsService.findByTrainerId(trainerId, skip, take);
  }
}
