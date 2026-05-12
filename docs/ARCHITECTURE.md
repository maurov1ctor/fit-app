# 📦 FitAPP Backend - Arquitetura Limpa

## 🏗️ Visão Geral da Arquitetura

Este projeto segue os princípios de **Arquitetura Limpa** com uma estrutura em camadas bem definida.

```
📁 backend/
├── 📁 src/
│   ├── 📁 modules/              # Módulos de negócio
│   │   ├── 📁 auth/            # Autenticação & Autorização
│   │   ├── 📁 users/           # Gerenciamento de usuários
│   │   ├── 📁 students/        # Perfil de alunos
│   │   ├── 📁 trainers/        # Perfil de treinadores
│   │   ├── 📁 exercises/       # Catálogo de exercícios
│   │   ├── 📁 workouts/        # Planos de treino
│   │   └── 📁 workout-logs/    # Histórico de treinos
│   ├── 📁 shared/              # Código compartilhado
│   │   └── 📁 prisma/          # Serviço de banco de dados
│   └── main.ts                 # Entrada da aplicação
├── 📁 prisma/
│   └── schema.prisma           # Definição do banco de dados
└── package.json
```

---

## 🔄 Fluxo de Dados

Cada módulo segue este padrão de camadas:

```
HTTP Request
    ↓
┌─────────────────────┐
│   CONTROLLER        │ → Valida entrada, orquestra rotas
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   SERVICE           │ → Lógica de negócio, validações
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   REPOSITORY        │ → Acesso ao banco de dados
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   DATABASE          │ → PostgreSQL + Prisma ORM
└─────────────────────┘
```

---

## 📋 Estrutura de Cada Módulo

### Exemplo: `Users Module`

```
📁 users/
├── dto/
│   ├── create-user.dto.ts      # Validação de entrada
│   ├── update-user.dto.ts      # Validação de atualização
│   ├── user-response.dto.ts    # Formato de resposta
│   └── index.ts                # Exports
├── users.controller.ts         # HTTP endpoints
├── users.service.ts            # Lógica de negócio
├── users.repository.ts         # Acesso ao DB
└── users.module.ts             # Organização do módulo
```

---

## 🛠️ Camadas Explicadas

### 1️⃣ **DTOs (Data Transfer Objects)**
Validam e transformam dados de entrada/saída.

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(8)
  password: string;
}
```

✅ Separação clara entre dados brutos e dados validados  
✅ Reutilização em múltiplos endpoints  
✅ Validação automática com class-validator

---

### 2️⃣ **Controllers**
Recebem requisições HTTP e orquestram o fluxo.

```typescript
@Controller('users')
export class UsersController {
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
```

✅ Lógica mínima de apresentação  
✅ Delegam trabalho para services  
✅ Aplicam guards de autenticação/autorização

---

### 3️⃣ **Services**
Contêm toda a lógica de negócio.

```typescript
@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    // Validações de negócio
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email já existe');
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    
    // Criar usuário
    return this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }
}
```

✅ Orquestração de múltiplas operações  
✅ Regras de negócio centralizadas  
✅ Tratamento de erros específicos

---

### 4️⃣ **Repositories**
Interagem com o banco de dados (abstração).

```typescript
@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
  
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

✅ Isolam detalhes do banco de dados  
✅ Facilitam testes (com mocks)  
✅ Permitem trocar de BD sem mexer em services

---

## 🔐 Segurança

### Guards (Protetores)

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Roles(UserRole.ADMIN)  // Apenas ADMINs
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

🔒 **JwtAuthGuard**: Valida token JWT  
🔒 **RolesGuard**: Valida permissões do usuário  
🔒 **@Roles()**: Define roles permitidos

---

## 📊 Módulos Principais

### 1️⃣ **Auth Module**
```
POST   /auth/register          - Criar conta
POST   /auth/login             - Fazer login
POST   /auth/refresh           - Renovar token
POST   /auth/logout            - Sair
```

### 2️⃣ **Users Module**
```
GET    /users                  - Listar usuários
GET    /users/:id              - Obter detalhes
POST   /users                  - Criar usuário (ADMIN)
PUT    /users/:id              - Atualizar (ADMIN)
DELETE /users/:id              - Deletar (ADMIN)
```

### 3️⃣ **Students Module**
```
GET    /students               - Listar alunos
GET    /students/:id           - Obter perfil
POST   /students/:userId       - Criar perfil
PUT    /students/:id           - Atualizar perfil
```

### 4️⃣ **Trainers Module**
```
GET    /trainers               - Listar treinadores
POST   /trainers/:userId       - Criar perfil
PUT    /trainers/:id           - Atualizar perfil
```

### 5️⃣ **Exercises Module**
```
GET    /exercises              - Listar exercícios
GET    /exercises/:id          - Obter detalhes
POST   /exercises              - Criar (TRAINER/ADMIN)
GET    /exercises/category/:category    - Por categoria
```

### 6️⃣ **Workouts Module**
```
GET    /workouts               - Listar treinos
POST   /workouts               - Criar treino (TRAINER)
PATCH  /workouts/:id/start     - Iniciar treino
PATCH  /workouts/:id/complete  - Completar treino
GET    /workouts/student/:studentId - Treinos do aluno
```

### 7️⃣ **Workout Logs Module**
```
GET    /workout-logs           - Histórico
POST   /workout-logs           - Criar registro
POST   /workout-logs/:id/exercise-logs - Adicionar exercício
PATCH  /workout-logs/:id/complete      - Marcar como completo
```

---

## ✅ Validações Implementadas

### Nível DTO (Entrada)
- Email válido
- Senhas fortes (maiúsculas, números, caracteres especiais)
- Comprimentos mínimos/máximos
- Tipos corretos

### Nível Service (Negócio)
- Email único
- Usuário existe antes de atualizar
- Permissões corretas
- Estados válidos (workflow)

### Nível Repository (DB)
- Transações atomares
- Índices para performance
- Relacionamentos intactos

---

## 🔌 Tipagem Completa

Todos os arquivos usam **TypeScript** com tipos estritos:

```typescript
// Tipos definidos em DTOs
export class CreateWorkoutDto {
  title: string;
  difficulty: DifficultyLevel;  // Enum definido no Prisma
  exercises: WorkoutExerciseDto[];
}

// Respostas tipadas
export class WorkoutResponseDto {
  id: string;
  title: string;
  exercises: ExerciseInWorkoutDto[];
}
```

---

## 🚀 Como Usar

### 1. Criar um novo módulo
```bash
mkdir -p src/modules/novo-modulo/dto
```

### 2. Seguir a estrutura padrão
```
novo-modulo/
├── dto/
│   ├── create-novo-modulo.dto.ts
│   ├── update-novo-modulo.dto.ts
│   ├── novo-modulo-response.dto.ts
│   └── index.ts
├── novo-modulo.controller.ts
├── novo-modulo.service.ts
├── novo-modulo.repository.ts
└── novo-modulo.module.ts
```

### 3. Adicionar ao app.module.ts
```typescript
imports: [
  // ... outros módulos
  NovoModuloModule,
]
```

---

## 🎯 Benefícios da Arquitetura

| Benefício | Descrição |
|-----------|-----------|
| **Separação de Responsabilidades** | Cada camada tem um propósito específico |
| **Testabilidade** | Fácil criar testes unitários (repositórios com mocks) |
| **Reutilização** | DTOs, Services e Repositories reutilizáveis |
| **Escalabilidade** | Adicionar novos módulos sem mexer em código existente |
| **Manutenibilidade** | Código organizado e previsível |
| **Performance** | Índices no DB, queries otimizadas |
| **Segurança** | Validação em múltiplas camadas, Guards de autenticação |

---

## 📚 Exemplo Completo: Criar um Workout

### 1. **Frontend envia:**
```json
{
  "title": "Treino Peito",
  "difficulty": "INTERMEDIATE",
  "duration": 60,
  "studentId": "uuid-aluno",
  "trainerId": "uuid-treinador",
  "exercises": [
    { "exerciseId": "uuid-exercise", "sets": 3, "reps": 10, "order": 1 }
  ]
}
```

### 2. **Controller recebe e valida (CreateWorkoutDto)**
- Valida campos obrigatórios
- Verifica tipos corretos
- Autoriza apenas TRAINER/ADMIN

### 3. **Service executa lógica**
- Verifica se aluno existe
- Verifica se treinador existe
- Valida exercícios duplicados
- Salva workout e exercícios

### 4. **Repository acessa BD**
- Cria registro em `Workout`
- Cria registros em `WorkoutExercise`
- Retorna dados completos

### 5. **Controller retorna resposta**
```json
{
  "id": "uuid-workout",
  "title": "Treino Peito",
  "status": "SCHEDULED",
  "exercises": [
    { "exerciseId": "uuid-exercise", "sets": 3, "reps": 10 }
  ]
}
```

---

## 🛠️ Stack Tecnológico

- **NestJS** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **class-validator** - Validação de DTOs
- **bcrypt** - Criptografia de senhas

---

## 📝 Próximos Passos

1. ✅ Implementar migrations Prisma
2. ✅ Criar seeds com dados de teste
3. ✅ Adicionar testes unitários
4. ✅ Documentar endpoints com Swagger
5. ✅ Implementar cache (Redis)
6. ✅ Adicionar logging e monitoring
7. ✅ Configurar CI/CD

---

**Desenvolvido seguindo as melhores práticas de engenharia de software! 🚀**
