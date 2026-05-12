# 🏋️ FitAPP Backend - README

## 📌 Visão Geral

FitAPP é um sistema completo de gerenciamento de treinos com arquitetura limpa em **NestJS + TypeScript + Prisma + PostgreSQL**.

```
┌─────────────────────────────────────────┐
│         Frontend (Mobile/Web)           │
└──────────────────┬──────────────────────┘
                   │ HTTP REST API
┌──────────────────▼──────────────────────┐
│         Backend NestJS                  │
├─────────────────────────────────────────┤
│ Auth | Users | Students | Trainers     │
│ Exercises | Workouts | Workout Logs    │
└──────────────────┬──────────────────────┘
                   │ ORM Prisma
┌──────────────────▼──────────────────────┐
│    PostgreSQL Database                  │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cp .env.example .env

# 3. Configurar DATABASE_URL no .env
DATABASE_URL="postgresql://user:password@localhost:5432/fitapp"

# 4. Executar migrations
npx prisma migrate dev --name init

# 5. Iniciar servidor
npm run start:dev
```

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/                 # Módulos de negócio
│   │   ├── auth/               # Autenticação
│   │   ├── users/              # Gerenciamento de usuários
│   │   ├── students/           # Perfis de alunos
│   │   ├── trainers/           # Perfis de treinadores
│   │   ├── exercises/          # Exercícios
│   │   ├── workouts/           # Planos de treino
│   │   └── workout-logs/       # Histórico
│   ├── shared/
│   │   └── prisma/             # Banco de dados
│   └── main.ts                 # Entry point
├── prisma/
│   └── schema.prisma           # Schema do BD
├── ARCHITECTURE.md             # Explicação da arquitetura
├── BEST_PRACTICES.md           # Guia de conventions
├── API_ROUTES.md               # Rotas da API
└── package.json
```

---

## 🏗️ Arquitetura Limpa (Clean Architecture)

Cada módulo segue este padrão:

```
Controller (HTTP) → Service (Lógica) → Repository (DB)
                         ↕
                       DTOs (Validação)
```

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Fácil de testar (componentes isolados)
- ✅ Escalável e manutenível
- ✅ Reutilizável em múltiplos contextos

---

## 📦 Módulos Implementados

### 1️⃣ **Auth Module**
Autenticação com JWT tokens

```bash
POST /auth/register      # Criar conta
POST /auth/login         # Fazer login
POST /auth/refresh       # Renovar token
POST /auth/logout        # Fazer logout
```

### 2️⃣ **Users Module**
Gerenciamento de usuários (ADMIN)

```bash
GET    /users            # Listar
POST   /users            # Criar
PUT    /users/:id        # Atualizar
DELETE /users/:id        # Deletar
```

### 3️⃣ **Students Module**
Perfis de alunos

```bash
GET    /students         # Listar
POST   /students/:id     # Criar perfil
PUT    /students/:id     # Atualizar
```

### 4️⃣ **Trainers Module**
Perfis de treinadores

```bash
GET    /trainers         # Listar
POST   /trainers/:id     # Criar perfil
PUT    /trainers/:id     # Atualizar
```

### 5️⃣ **Exercises Module**
Catálogo de exercícios

```bash
GET    /exercises                    # Listar
POST   /exercises                    # Criar
GET    /exercises/category/:cat      # Por categoria
GET    /exercises/difficulty/:diff   # Por dificuldade
```

### 6️⃣ **Workouts Module**
Planos de treino

```bash
GET    /workouts                     # Listar
POST   /workouts                     # Criar
PATCH  /workouts/:id/start           # Iniciar
PATCH  /workouts/:id/complete        # Completar
GET    /workouts/student/:id         # Do aluno
```

### 7️⃣ **Workout Logs Module**
Histórico de execução

```bash
GET    /workout-logs                 # Listar
POST   /workout-logs                 # Criar registro
POST   /workout-logs/:id/exercise-logs  # Adicionar exercício
```

---

## 🔐 Segurança

### Autenticação
- JWT tokens com expiração
- Refresh tokens rotacionados
- Senhas com bcrypt (salt 12)

### Autorização
- Guards por roles (Admin, Trainer, Student)
- Controle granular de acesso
- Decoradores @Roles

### Validação
- DTOs com class-validator
- Tipagem completa em TypeScript
- Validação em múltiplas camadas

---

## 🗄️ Banco de Dados

### Modelos Principais

```prisma
User                    # Base para todos
├── Student            # Alunos
├── Trainer            # Treinadores
├── RefreshToken       # Tokens
│
Workout                 # Planos
├── Exercise           # Exercícios
├── WorkoutExercise    # Relação
│
WorkoutLog             # Execução
└── ExerciseLog        # Detalhes
```

### Otimizações
- Índices nas colunas frequentemente consultadas
- Relacionamentos com `onDelete: Cascade`
- UUIDs para segurança

---

## 📝 DTOs com Validação

Todos os DTOs incluem validações automáticas:

```typescript
// ✅ Email válido
// ✅ Senhas fortes (maiúsc, números, símbolos)
// ✅ Comprimentos mínimos/máximos
// ✅ Enums tipados
// ✅ Campos obrigatórios/opcionais
```

---

## 🧪 Testing

### Estrutura de Testes
```bash
npm run test              # Rodar testes
npm run test:watch       # Watch mode
npm run test:cov         # Com cobertura
```

### Exemplo
```typescript
describe('UsersService', () => {
  it('deve criar um usuário', async () => {
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
  });
});
```

---

## 📊 Performance

### Boas Práticas Implementadas

✅ Paginação em todas as listagens  
✅ Índices no banco de dados  
✅ Select/Include otimizado  
✅ Lazy loading de relacionamentos  
✅ Cache-ready architecture  

---

## 🚦 Variáveis de Ambiente

```bash
# .env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/fitapp
JWT_ACCESS_SECRET=seu-secret-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-aqui
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 📚 Documentação

- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - Explicação detalhada
- 📖 [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Como adicionar módulos
- 📖 [API_ROUTES.md](./API_ROUTES.md) - Todas as rotas

---

## 🛠️ Scripts Disponíveis

```bash
npm run start           # Produção
npm run start:dev       # Desenvolvimento (watch mode)
npm run build           # Build para produção
npm run lint            # ESLint
npm run format          # Prettier
npm run test            # Testes
```

---

## 🔄 Workflow Típico

1. **Cliente registra** → User criado
2. **Cliente faz login** → JWT token recebido
3. **Cliente cria perfil** → Student/Trainer criado
4. **Treinador cria workout** → Com lista de exercícios
5. **Aluno inicia workout** → Status muda para IN_PROGRESS
6. **Aluno executa exercícios** → Adiciona logs
7. **Aluno completa workout** → Histórico salvo
8. **Consultar progresso** → Ver todos os workouts concluídos

---

## 🐛 Troubleshooting

### Erro de conexão com BD
```bash
# Verificar .env
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL -c "SELECT 1"
```

### Migrations falhando
```bash
# Reset (cuidado em produção!)
npx prisma migrate reset

# Ou criar nova migration
npx prisma migrate dev --name fix_name
```

### Módulo não encontrado
```bash
# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Próximos Passos

- [ ] Implementar testes e2e
- [ ] Adicionar documentação Swagger
- [ ] Setup de CI/CD
- [ ] Implementar cache (Redis)
- [ ] Adicionar logging
- [ ] Monitoring com Sentry
- [ ] Rate limiting
- [ ] Backup automático

---

## 🤝 Contribuindo

1. Criar branch (`git checkout -b feature/minha-feature`)
2. Commit mudanças (`git commit -am 'Adiciona feature'`)
3. Push para branch (`git push origin feature/minha-feature`)
4. Abrir Pull Request

---

## 📄 Licença

MIT

---

## 📞 Suporte

Para dúvidas ou issues, abrir uma issue no GitHub.

---

**Desenvolvido com ❤️ usando NestJS, TypeScript e Prisma** 🚀
