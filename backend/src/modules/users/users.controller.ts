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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    return this.usersService.findAll(skip, take);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Get('role/:role')
  @Roles(UserRole.ADMIN)
  async findByRole(@Param('role') role: UserRole): Promise<UserResponseDto[]> {
    return this.usersService.findByRole(role);
  }
}
