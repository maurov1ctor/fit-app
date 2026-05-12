import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TrainersRepository } from './trainers.repository';
import { CreateTrainerDto, UpdateTrainerDto, TrainerResponseDto } from './dto';

@Injectable()
export class TrainersService {
  constructor(private trainersRepository: TrainersRepository) {}

  async findById(id: string): Promise<TrainerResponseDto> {
    const trainer = await this.trainersRepository.findById(id);
    if (!trainer) {
      throw new NotFoundException(`Treinador com ID ${id} não encontrado`);
    }
    return this.mapToResponseDto(trainer);
  }

  async findByUserId(userId: string): Promise<TrainerResponseDto> {
    const trainer = await this.trainersRepository.findByUserId(userId);
    if (!trainer) {
      throw new NotFoundException(
        `Treinador com usuário ID ${userId} não encontrado`,
      );
    }
    return this.mapToResponseDto(trainer);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ trainers: TrainerResponseDto[]; total: number }> {
    const [trainers, total] = await Promise.all([
      this.trainersRepository.findAll(skip, take),
      this.trainersRepository.count(),
    ]);
    return {
      trainers: trainers.map((trainer) => this.mapToResponseDto(trainer)),
      total,
    };
  }

  async create(
    userId: string,
    createTrainerDto: CreateTrainerDto,
  ): Promise<TrainerResponseDto> {
    // Verificar se já existe treinador para este usuário
    const existingTrainer = await this.trainersRepository.findByUserId(userId);
    if (existingTrainer) {
      throw new ConflictException('Este usuário já é um treinador');
    }

    const trainer = await this.trainersRepository.create({
      userId,
      ...createTrainerDto,
    });

    return this.mapToResponseDto(trainer);
  }

  async update(
    id: string,
    updateTrainerDto: UpdateTrainerDto,
  ): Promise<TrainerResponseDto> {
    const trainer = await this.trainersRepository.findById(id);
    if (!trainer) {
      throw new NotFoundException(`Treinador com ID ${id} não encontrado`);
    }

    const updatedTrainer = await this.trainersRepository.update(
      id,
      updateTrainerDto,
    );
    return this.mapToResponseDto(updatedTrainer);
  }

  async delete(id: string): Promise<void> {
    const trainer = await this.trainersRepository.findById(id);
    if (!trainer) {
      throw new NotFoundException(`Treinador com ID ${id} não encontrado`);
    }

    await this.trainersRepository.delete(id);
  }

  private mapToResponseDto(trainer: any): TrainerResponseDto {
    return {
      id: trainer.id,
      userId: trainer.userId,
      specialization: trainer.specialization,
      certification: trainer.certification,
      yearsExperience: trainer.yearsExperience,
      bio: trainer.bio,
      createdAt: trainer.createdAt,
      updatedAt: trainer.updatedAt,
    };
  }
}
