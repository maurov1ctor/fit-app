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
import { TrainersService } from './trainers.service';
import {
  CreateTrainerDto,
  UpdateTrainerDto,
  TrainerResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('trainers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainersController {
  constructor(private trainersService: TrainersService) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TrainerResponseDto> {
    return this.trainersService.findById(id);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ trainers: TrainerResponseDto[]; total: number }> {
    return this.trainersService.findAll(skip, take);
  }

  @Post(':userId')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async create(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() createTrainerDto: CreateTrainerDto,
  ): Promise<TrainerResponseDto> {
    return this.trainersService.create(userId, createTrainerDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ): Promise<TrainerResponseDto> {
    return this.trainersService.update(id, updateTrainerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.trainersService.delete(id);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<TrainerResponseDto> {
    return this.trainersService.findByUserId(userId);
  }
}
