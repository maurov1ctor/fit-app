import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { StudentsRepository } from './students.repository';
import { CreateStudentDto, UpdateStudentDto, StudentResponseDto } from './dto';

@Injectable()
export class StudentsService {
  constructor(private studentsRepository: StudentsRepository) {}

  async findById(id: string): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }
    return this.mapToResponseDto(student);
  }

  async findByUserId(userId: string): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findByUserId(userId);
    if (!student) {
      throw new NotFoundException(
        `Aluno com usuário ID ${userId} não encontrado`,
      );
    }
    return this.mapToResponseDto(student);
  }

  async findAll(
    skip: number = 0,
    take: number = 10,
  ): Promise<{ students: StudentResponseDto[]; total: number }> {
    const [students, total] = await Promise.all([
      this.studentsRepository.findAll(skip, take),
      this.studentsRepository.count(),
    ]);
    return {
      students: students.map((student) => this.mapToResponseDto(student)),
      total,
    };
  }

  async create(
    userId: string,
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    // Verificar se já existe aluno para este usuário
    const existingStudent = await this.studentsRepository.findByUserId(userId);
    if (existingStudent) {
      throw new ConflictException('Este usuário já é um aluno');
    }

    const student = await this.studentsRepository.create({
      userId,
      ...createStudentDto,
    });

    return this.mapToResponseDto(student);
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }

    const updatedStudent = await this.studentsRepository.update(
      id,
      updateStudentDto,
    );
    return this.mapToResponseDto(updatedStudent);
  }

  async delete(id: string): Promise<void> {
    const student = await this.studentsRepository.findById(id);
    if (!student) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }

    await this.studentsRepository.delete(id);
  }

  private mapToResponseDto(student: any): StudentResponseDto {
    return {
      id: student.id,
      userId: student.userId,
      age: student.age,
      weight: student.weight,
      height: student.height,
      goal: student.goal,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}
