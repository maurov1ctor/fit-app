import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }
    return this.mapToResponseDto(user);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const [users, total] = await Promise.all([
      this.usersRepository.findAll(skip, take),
      this.usersRepository.count(),
    ]);
    return {
      users: users.map((user) => this.mapToResponseDto(user)),
      total,
    };
  }

  async findByRole(role: UserRole): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findByRole(role);
    return users.map((user) => this.mapToResponseDto(user));
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar se email já existe
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Criar usuário
    const user = await this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role,
    });

    return this.mapToResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Verificar se usuário existe
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Se está tentando atualizar email, verificar se já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return this.mapToResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.usersRepository.delete(id);
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
