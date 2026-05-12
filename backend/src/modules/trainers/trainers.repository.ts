import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Trainer } from '@prisma/client';

@Injectable()
export class TrainersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Trainer | null> {
    return this.prisma.trainer.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string): Promise<Trainer | null> {
    return this.prisma.trainer.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<Trainer[]> {
    return this.prisma.trainer.findMany({
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    specialization?: string;
    certification?: string;
    yearsExperience?: number;
    bio?: string;
  }): Promise<Trainer> {
    return this.prisma.trainer.create({
      data,
      include: { user: true },
    });
  }

  async update(
    id: string,
    data: {
      specialization?: string;
      certification?: string;
      yearsExperience?: number;
      bio?: string;
    },
  ): Promise<Trainer> {
    return this.prisma.trainer.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id: string): Promise<Trainer> {
    return this.prisma.trainer.delete({
      where: { id },
      include: { user: true },
    });
  }

  async count(): Promise<number> {
    return this.prisma.trainer.count();
  }
}
