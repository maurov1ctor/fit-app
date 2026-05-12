import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(50)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Senha deve conter maiúsculas, minúsculas, números e caracteres especiais',
    },
  )
  password: string;

  @IsString()
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Sobrenome deve ter no mínimo 2 caracteres' })
  @MaxLength(50)
  lastName: string;

  @IsEnum(UserRole, {
    message: `Role deve ser um de: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}
