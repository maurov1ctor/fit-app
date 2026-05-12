import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Student } from '@prisma/client';

@Injectable()
export class StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<Student[]> {
    return this.prisma.student.findMany({
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
  }): Promise<Student> {
    return this.prisma.student.create({
      data,
      include: { user: true },
    });
  }

  async update(
    id: string,
    data: {
      age?: number;
      weight?: number;
      height?: number;
      goal?: string;
    },
  ): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id: string): Promise<Student> {
    return this.prisma.student.delete({
      where: { id },
      include: { user: true },
    });
  }

  async count(): Promise<number> {
    return this.prisma.student.count();
  }
}
