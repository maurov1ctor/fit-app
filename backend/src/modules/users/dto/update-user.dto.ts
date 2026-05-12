import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Sobrenome deve ter no mínimo 2 caracteres' })
  @MaxLength(50)
  lastName?: string;
}
