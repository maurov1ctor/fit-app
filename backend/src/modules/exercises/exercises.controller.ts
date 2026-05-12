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
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
  ExerciseResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole, ExerciseCategory, DifficultyLevel } from '@prisma/client';

@Controller('exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ExerciseResponseDto> {
    return this.exercisesService.findById(id);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ exercises: ExerciseResponseDto[]; total: number }> {
    return this.exercisesService.findAll(skip, take);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    return this.exercisesService.create(createExerciseDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.exercisesService.delete(id);
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: ExerciseCategory,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ exercises: ExerciseResponseDto[]; total: number }> {
    return this.exercisesService.findByCategory(category, skip, take);
  }

  @Get('difficulty/:difficulty')
  async findByDifficulty(
    @Param('difficulty') difficulty: DifficultyLevel,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ exercises: ExerciseResponseDto[]; total: number }> {
    return this.exercisesService.findByDifficulty(difficulty, skip, take);
  }
}
