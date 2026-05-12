import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}
