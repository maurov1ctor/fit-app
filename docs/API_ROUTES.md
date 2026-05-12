# 🗺️ Rotas da API FitAPP

## 🔐 Autenticação (Auth Module)

```http
POST   /auth/register              Criar conta
POST   /auth/login                 Fazer login
POST   /auth/refresh               Renovar token JWT
POST   /auth/logout                Fazer logout (requer autenticação)
```

---

## 👥 Usuários (Users Module)

```http
GET    /users                      Listar todos os usuários (ADMIN)
GET    /users/:id                  Obter detalhes de um usuário
POST   /users                      Criar novo usuário (ADMIN)
PUT    /users/:id                  Atualizar usuário (ADMIN)
DELETE /users/:id                  Desativar usuário (ADMIN)
GET    /users/role/:role           Listar por role (ADMIN)
```

**Query Params:**
- `skip=0` - Número de itens a pular
- `take=10` - Número de itens a trazer

**Roles:**
- `ADMIN` - Administrador
- `TRAINER` - Treinador
- `STUDENT` - Aluno

---

## 🎓 Alunos (Students Module)

```http
GET    /students                   Listar todos os alunos
GET    /students/:id               Obter perfil do aluno
GET    /students/user/:userId      Obter aluno por usuário
POST   /students/:userId           Criar perfil de aluno
PUT    /students/:id               Atualizar perfil do aluno
DELETE /students/:id               Deletar perfil do aluno (ADMIN)
```

**Request Body (POST/PUT):**
```json
{
  "age": 25,
  "weight": 80,
  "height": 180,
  "goal": "Ganhar massa muscular"
}
```

---

## 💪 Treinadores (Trainers Module)

```http
GET    /trainers                   Listar todos os treinadores
GET    /trainers/:id               Obter perfil do treinador
GET    /trainers/user/:userId      Obter treinador por usuário
POST   /trainers/:userId           Criar perfil de treinador
PUT    /trainers/:id               Atualizar perfil do treinador
DELETE /trainers/:id               Deletar perfil do treinador (ADMIN)
```

**Request Body (POST/PUT):**
```json
{
  "specialization": "Musculação",
  "certification": "CREF",
  "yearsExperience": 5,
  "bio": "Especialista em hipertrofia"
}
```

---

## 🏋️ Exercícios (Exercises Module)

```http
GET    /exercises                  Listar todos os exercícios
GET    /exercises/:id              Obter detalhes de um exercício
POST   /exercises                  Criar novo exercício (TRAINER/ADMIN)
PUT    /exercises/:id              Atualizar exercício (TRAINER/ADMIN)
DELETE /exercises/:id              Deletar exercício (ADMIN)
GET    /exercises/category/:category      Listar por categoria
GET    /exercises/difficulty/:difficulty  Listar por dificuldade
```

**Categorias:**
- `STRENGTH` - Força
- `CARDIO` - Cardio
- `FLEXIBILITY` - Flexibilidade
- `BALANCE` - Equilíbrio
- `ENDURANCE` - Resistência

**Níveis de Dificuldade:**
- `BEGINNER` - Iniciante
- `INTERMEDIATE` - Intermediário
- `ADVANCED` - Avançado
- `EXPERT` - Especialista

**Request Body (POST/PUT):**
```json
{
  "name": "Supino",
  "description": "Exercício para peito",
  "category": "STRENGTH",
  "difficulty": "INTERMEDIATE",
  "imageUrl": "https://...",
  "videoUrl": "https://...",
  "instructions": "Deitado no banco..."
}
```

---

## 🏃 Workouts (Workouts Module)

### Gerenciar Workouts

```http
GET    /workouts                   Listar workouts com filtros
GET    /workouts/:id               Obter detalhes do workout
POST   /workouts                   Criar novo workout (TRAINER/ADMIN)
PUT    /workouts/:id               Atualizar workout (TRAINER/ADMIN)
DELETE /workouts/:id               Deletar workout (TRAINER/ADMIN)
```

### Controlar Status

```http
PATCH  /workouts/:id/start         Iniciar workout
PATCH  /workouts/:id/complete      Completar workout
PATCH  /workouts/:id/cancel        Cancelar workout (TRAINER/ADMIN)
```

### Listar por Contexto

```http
GET    /workouts/student/:studentId    Workouts de um aluno
GET    /workouts/trainer/:trainerId    Workouts de um treinador
```

**Query Params:**
- `skip=0` - Paginação
- `take=10` - Paginação
- `studentId=uuid` - Filtro por aluno
- `trainerId=uuid` - Filtro por treinador
- `status=SCHEDULED` - Filtro por status

**Statuses:**
- `SCHEDULED` - Agendado
- `IN_PROGRESS` - Em andamento
- `COMPLETED` - Completado
- `CANCELLED` - Cancelado

**Request Body (POST):**
```json
{
  "title": "Treino Peito",
  "description": "Focar em desenvolvimento de peito",
  "difficulty": "INTERMEDIATE",
  "duration": 60,
  "studentId": "uuid-aluno",
  "trainerId": "uuid-treinador",
  "scheduledAt": "2026-05-15T10:00:00Z",
  "exercises": [
    {
      "exerciseId": "uuid-exercise",
      "sets": 3,
      "reps": 10,
      "weight": 100,
      "order": 1
    }
  ]
}
```

---

## 📊 Workout Logs (Workout Logs Module)

### Gerenciar Registros

```http
GET    /workout-logs               Listar registros
GET    /workout-logs/:id           Obter detalhes do registro
POST   /workout-logs               Criar registro (STUDENT/TRAINER/ADMIN)
PUT    /workout-logs/:id           Atualizar registro
DELETE /workout-logs/:id           Deletar registro (TRAINER/ADMIN)
```

### Adicionar Dados

```http
POST   /workout-logs/:id/exercise-logs       Adicionar exercício ao log
PATCH  /workout-logs/:id/complete            Marcar como completo
```

### Consultar por Contexto

```http
GET    /workout-logs/workout/:workoutId      Registros de um workout
GET    /workout-logs/student/:studentId      Registros de um aluno
```

**Request Body (POST - criar log):**
```json
{
  "workoutId": "uuid-workout",
  "studentId": "uuid-aluno",
  "startedAt": "2026-05-15T10:00:00Z",
  "endedAt": "2026-05-15T11:00:00Z",
  "notes": "Treino foi cansativo",
  "exerciseLogs": [
    {
      "exerciseId": "uuid-exercise",
      "setsCompleted": 3,
      "repsCompleted": 10,
      "weightUsed": 100,
      "notes": "Sentia dor no ombro"
    }
  ]
}
```

**Request Body (POST - adicionar exercício):**
```json
{
  "exerciseId": "uuid-exercise",
  "setsCompleted": 3,
  "repsCompleted": 10,
  "weightUsed": 100,
  "duration": 180,
  "notes": "Executado com perfeição"
}
```

---

## 🔒 Headers Obrigatórios

Todas as rotas requerem autenticação (exceto `/auth/register` e `/auth/login`):

```http
Authorization: Bearer <seu_jwt_token>
Content-Type: application/json
```

---

## ✅ Exemplos de Requisições

### 1. Registrar um usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aluno@fitapp.com",
    "password": "Senha@123",
    "firstName": "João",
    "lastName": "Silva",
    "role": "STUDENT"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aluno@fitapp.com",
    "password": "Senha@123"
  }'
```

### 3. Criar perfil de aluno
```bash
curl -X POST http://localhost:3000/students/uuid-user-id \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "weight": 80,
    "height": 180,
    "goal": "Ganhar massa muscular"
  }'
```

### 4. Criar exercício
```bash
curl -X POST http://localhost:3000/exercises \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Supino Inclinado",
    "category": "STRENGTH",
    "difficulty": "INTERMEDIATE",
    "instructions": "Ajuste o banco em 45 graus..."
  }'
```

### 5. Criar workout
```bash
curl -X POST http://localhost:3000/workouts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Treino A",
    "difficulty": "INTERMEDIATE",
    "duration": 60,
    "studentId": "uuid-aluno",
    "trainerId": "uuid-treinador",
    "exercises": [
      {
        "exerciseId": "uuid-exercise",
        "sets": 3,
        "reps": 10,
        "order": 1
      }
    ]
  }'
```

### 6. Iniciar workout
```bash
curl -X PATCH http://localhost:3000/workouts/uuid-workout/start \
  -H "Authorization: Bearer <token>"
```

### 7. Registrar exercício completado
```bash
curl -X POST http://localhost:3000/workout-logs/uuid-log/exercise-logs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "uuid-exercise",
    "setsCompleted": 3,
    "repsCompleted": 10,
    "weightUsed": 100
  }'
```

---

## 📋 Códigos de Resposta HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 204 | No Content - Sem conteúdo |
| 400 | Bad Request - Requisição inválida |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Acesso negado |
| 404 | Not Found - Não encontrado |
| 409 | Conflict - Conflito (ex: email duplicado) |
| 500 | Internal Server Error - Erro do servidor |

---

## 🔄 Fluxo Típico

1. **Registrar/Login** → Recebe JWT token
2. **Enviar token** em todas as requisições autenticadas
3. **Criar perfil** (Student/Trainer) após criar User
4. **Criar exercícios** (se for Trainer)
5. **Criar workout** com exercícios
6. **Iniciar workout**
7. **Registrar progressos** no log
8. **Completar workout**
9. **Consultar histórico** de workouts

---

**Use este guia como referência para testar a API! 🚀**
