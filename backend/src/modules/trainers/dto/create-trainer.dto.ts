import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateTrainerDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  certification?: string;

  @IsOptional()
  @IsInt({ message: 'Anos de experiência deve ser um número' })
  @Min(0, { message: 'Anos de experiência deve ser maior ou igual a 0' })
  yearsExperience?: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
