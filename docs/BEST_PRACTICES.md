# 📖 Guia de Boas Práticas - FitAPP Backend

## ✅ Convenções do Projeto

### Nomes de Arquivos

```
✅ CORRETO:
- users.controller.ts
- users.service.ts
- users.repository.ts
- create-user.dto.ts
- user-response.dto.ts

❌ ERRADO:
- UserController.ts
- users_controller.ts
- user-controller.ts
```

### Estrutura de Pastas

```
✅ CORRETO:
modules/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── index.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   └── users.module.ts

❌ ERRADO:
modules/
└── user/                    # singular em vez de plural
    ├── controller.ts        # sem prefixo de domínio
    ├── service.ts
```

---

## 🏗️ Criando um Novo Módulo

### Passo 1: Criar Diretório
```bash
mkdir -p src/modules/novo-modulo/dto
```

### Passo 2: Criar DTOs
```typescript
// novo-modulo/dto/create-novo-modulo.dto.ts
import { IsString, MinLength } from 'class-validator';

export class CreateNovoModuloDto {
  @IsString()
  @MinLength(3)
  name: string;
}
```

### Passo 3: Criar Repository
```typescript
// novo-modulo/novo-modulo.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class NovoModuloRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.novoModulo.create({ data });
  }
  
  // ... outros métodos CRUD
}
```

### Passo 4: Criar Service
```typescript
// novo-modulo/novo-modulo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { NovoModuloRepository } from './novo-modulo.repository';

@Injectable()
export class NovoModuloService {
  constructor(private repository: NovoModuloRepository) {}

  async create(dto: CreateNovoModuloDto) {
    // Lógica de negócio aqui
    return this.repository.create(dto);
  }
}
```

### Passo 5: Criar Controller
```typescript
// novo-modulo/novo-modulo.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NovoModuloService } from './novo-modulo.service';
import { CreateNovoModuloDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('novo-modulo')
@UseGuards(JwtAuthGuard)
export class NovoModuloController {
  constructor(private service: NovoModuloService) {}

  @Post()
  async create(@Body() dto: CreateNovoModuloDto) {
    return this.service.create(dto);
  }
}
```

### Passo 6: Criar Module
```typescript
// novo-modulo/novo-modulo.module.ts
import { Module } from '@nestjs/common';
import { NovoModuloController } from './novo-modulo.controller';
import { NovoModuloService } from './novo-modulo.service';
import { NovoModuloRepository } from './novo-modulo.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NovoModuloController],
  providers: [NovoModuloService, NovoModuloRepository],
  exports: [NovoModuloService],
})
export class NovoModuloModule {}
```

### Passo 7: Importar no App Module
```typescript
// app.module.ts
import { NovoModuloModule } from './modules/novo-modulo/novo-modulo.module';

@Module({
  imports: [
    // ... outros módulos
    NovoModuloModule,
  ],
})
export class AppModule {}
```

---

## 🎯 Tratamento de Erros

### Padrão de Exceções

```typescript
// ✅ CORRETO
async findById(id: string) {
  const user = await this.repository.findById(id);
  
  if (!user) {
    throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
  }
  
  return this.mapToResponseDto(user);
}

// ❌ ERRADO
async findById(id: string) {
  const user = await this.repository.findById(id);
  if (!user) return null;  // Nunca retorne null
  return user;
}
```

### Tipos de Exceções

```typescript
import {
  BadRequestException,      // 400 - Requisição inválida
  UnauthorizedException,    // 401 - Não autenticado
  ForbiddenException,       // 403 - Acesso negado
  NotFoundException,        // 404 - Não encontrado
  ConflictException,        // 409 - Conflito (email duplicado)
  InternalServerErrorException, // 500 - Erro interno
} from '@nestjs/common';

// Exemplo de uso
if (emailExists) {
  throw new ConflictException('Email já cadastrado');
}
```

---

## 🔍 Validação em DTOs

### Decoradores Comuns

```typescript
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class ExampleDto {
  // Strings
  @IsString()
  @MinLength(3, { message: 'Deve ter no mínimo 3 caracteres' })
  @MaxLength(50)
  name: string;

  // Email
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  // Números
  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  // Opcional
  @IsOptional()
  @IsString()
  bio?: string;

  // Enum
  @IsEnum(UserRole, {
    message: `Role deve ser: ${Object.values(UserRole).join(', ')}`
  })
  role: UserRole;

  // Nested Objects
  @ValidateNested({ each: true })
  @Type(() => NestedDto)
  nested: NestedDto[];

  // Array
  @ArrayMinSize(1)
  items: string[];
}
```

---

## 🔐 Guards e Autorização

### Usando Guards

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  // Qualquer usuário autenticado
  @Get()
  getInfo() { }

  // Apenas ADMIN
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) { }

  // ADMIN ou TRAINER
  @Roles(UserRole.ADMIN, UserRole.TRAINER)
  @Post()
  createWorkout() { }
}
```

---

## 🧹 Mapping de Dados (DTO Response)

### Padrão de Mapping

```typescript
// Service
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
    // NUNCA retorne a senha!
    // NUNCA retorne campos internos!
  };
}

// Uso no service
async findById(id: string): Promise<UserResponseDto> {
  const user = await this.repository.findById(id);
  if (!user) {
    throw new NotFoundException('Usuário não encontrado');
  }
  return this.mapToResponseDto(user); // Sempre mapear!
}
```

---

## 📊 Paginação

### Implementar em Controller e Service

```typescript
// Controller
@Get()
async findAll(
  @Query('skip') skip: number = 0,
  @Query('take') take: number = 10,
) {
  return this.service.findAll(skip, take);
}

// Service
async findAll(
  skip: number = 0,
  take: number = 10,
): Promise<{ items: ItemDto[]; total: number }> {
  const [items, total] = await Promise.all([
    this.repository.findAll(skip, take),
    this.repository.count(),
  ]);
  
  return {
    items: items.map(item => this.mapToResponseDto(item)),
    total,
  };
}

// Repository
async findAll(skip: number = 0, take: number = 10): Promise<Item[]> {
  return this.prisma.item.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });
}
```

---

## 🔄 Transações (quando necessário)

```typescript
// Repository com transação
async createWithDetails(workoutData, exerciseData) {
  return this.prisma.$transaction(async (tx) => {
    const workout = await tx.workout.create({
      data: workoutData,
    });

    await tx.workoutExercise.createMany({
      data: exerciseData.map(e => ({
        ...e,
        workoutId: workout.id,
      })),
    });

    return workout;
  });
}
```

---

## 🧪 Testes (Estrutura)

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe('findById', () => {
    it('deve retornar um usuário', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser as any);

      const result = await service.findById('1');

      expect(result).toEqual(expect.objectContaining({ id: '1' }));
    });
  });
});
```

---

## 🚀 Performance

### Índices no Prisma

```prisma
model User {
  id    String @id @default(uuid()) @db.Uuid
  email String @unique
  role  UserRole
  
  @@index([email])
  @@index([role])
}
```

### Select/Include Eficiente

```typescript
// ✅ CORRETO - Buscar apenas dados necessários
async findById(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      // Não incluir refreshTokens se não precisar
    },
  });
}

// ❌ ERRADO - Buscar tudo
async findById(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
  }); // Traz todos os campos, inclusive senha!
}
```

---

## 📋 Checklist para novo Módulo

- [ ] DTOs criados com validações
- [ ] Repository com métodos CRUD
- [ ] Service com lógica de negócio
- [ ] Controller com rotas e guards
- [ ] Module exportando tudo corretamente
- [ ] Importado no app.module.ts
- [ ] Testado no Postman/Insomnia
- [ ] Documentado (comentários nas funções complexas)
- [ ] Sem senhas/dados sensíveis nas respostas
- [ ] Tratamento de erros implementado

---

**Siga estes padrões para manter o código limpo e escalável! 🎯**
