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
import { StudentsService } from './students.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StudentResponseDto> {
    return this.studentsService.findById(id);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ students: StudentResponseDto[]; total: number }> {
    return this.studentsService.findAll(skip, take);
  }

  @Post(':userId')
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async create(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.create(userId, createStudentDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.studentsService.delete(id);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<StudentResponseDto> {
    return this.studentsService.findByUserId(userId);
  }
}
