import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';

export class CreateStudentDto {
  @IsOptional()
  @IsInt({ message: 'Idade deve ser um número inteiro' })
  @Min(13, { message: 'Idade mínima é 13 anos' })
  @Max(120, { message: 'Idade inválida' })
  age?: number;

  @IsOptional()
  @IsInt({ message: 'Peso deve ser um número' })
  @Min(20, { message: 'Peso deve ser maior que 20kg' })
  @Max(500, { message: 'Peso inválido' })
  weight?: number;

  @IsOptional()
  @IsInt({ message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura deve ser maior que 100cm' })
  @Max(250, { message: 'Altura inválida' })
  height?: number;

  @IsOptional()
  @IsString()
  goal?: string;
}
