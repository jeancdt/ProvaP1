# Sistema de Voluntariado IFRS

Prova P1 - Desenvolvimento de Aplicações Corporativas

## Sobre o Projeto

Sistema para gerenciar eventos e voluntários. Foi desenvolvido usando Node.js no backend e React no frontend.

Principais funcionalidades:

- Login com JWT
- Controle de usuários (admin e user)
- CRUD completo de eventos (criar, listar, editar e excluir)
- CRUD completo de voluntários (criar, listar, editar e excluir)
- Arquitetura em camadas (Model-Service-Controller)
- Proteção de rotas por autenticação e autorização

## Tecnologias Utilizadas

**Backend:**

- Node.js + Express
- MySQL
- Prisma ORM (gerenciamento de banco de dados)
- JWT para autenticação
- Bcrypt para criptografia de senhas
- Winston (logger para monitoramento e logs estruturados)
- Jest (testes unitários e de integração)
- Supertest (testes de API/E2E)

**Frontend:**

- React
- Vite
- React Router
- Axios

## O que você precisa ter instalado

- Node.js
- MySQL
- npm ou yarn

## Como rodar o projeto

### 1. Clone e instale as dependências

Backend:

```bash
cd projeto-jwt
npm install
```

Frontend:

```bash
cd front-auth
npm install
```

### 2. Configure o Banco de Dados com Prisma

O projeto utiliza **Prisma ORM** para gerenciar o banco de dados.

> [!IMPORTANT] > **Antes de executar os comandos abaixo**, certifique-se de que o banco de dados `projeto_jwt_db` foi criado no MySQL. Caso contrário, a seed não funcionará. Você pode criar o banco de dados executando o seguinte comando SQL:
>
> ```sql
> CREATE DATABASE IF NOT EXISTS projeto_jwt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

Execute os seguintes comandos para configurar:

```bash
cd projeto-jwt

# Gera o Prisma Client
npx prisma generate

# Aplica as migrations no banco de dados
npx prisma migrate dev

# Popula o banco com dados iniciais (seeds)
npx prisma db seed
```

**Comandos Prisma úteis:**

```bash
# Resetar o banco de dados (apaga tudo e recria)
npx prisma migrate reset

# Criar uma nova migration
npx prisma migrate dev

# Abrir o Prisma Studio (interface visual para ver/editar dados)
npx prisma studio

# Gerar o Prisma Client após alterações no schema
npx prisma generate
```

### 3. Configure o arquivo .env

Crie um arquivo `.env` dentro da pasta `projeto-jwt/` com:

```env
# Servidor
PORT=3000

# Banco de Dados (Prisma)
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:sua_porta/nome_do_seu_banco"

# JWT
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=24h
```

### 4. Rodando a aplicação

Backend:

```bash
cd projeto-jwt
npm run dev
```

Vai rodar em http://localhost:3000

Frontend (abra outro terminal):

```bash
cd front-auth
npm run dev
```

Vai rodar em http://localhost:5173

## Usuários para testar

O banco já vem com 2 usuários:

- **Usuário comum:** usuario@ifrs.edu.br / 123456
  - Pode ver o dashboard, listar eventos e voluntários
  - Não consegue criar, editar ou deletar nada
- **Admin:** admin@ifrs.edu.br / admin123
  - Tem acesso total ao sistema
  - Pode criar, editar e deletar eventos e voluntários

**Dica:** Loga com os dois usuários em abas diferentes pra ver a diferença de permissões!

## Principais Rotas da API

**Autenticação:**

```
POST /auth/login
```

**Rotas Públicas:**

```
GET /events - Listar todos os eventos
```

**Rotas Protegidas (logado - user/admin):**

```
GET /dashboard - Painel do usuário
GET /admin - Painel admin (só admin)
```

**Eventos (admin):**

```
POST /events - Criar evento
PUT /events/:id - Editar evento
DELETE /events/:id - Excluir evento
```

**Voluntários (admin):**

```
GET /volunteers - Listar voluntários (precisa login)
GET /volunteers/:id - Buscar voluntário por ID (precisa login)
POST /volunteers - Cadastrar voluntário (só admin)
PUT /volunteers/:id - Editar voluntário (só admin)
DELETE /volunteers/:id - Excluir voluntário (só admin)
```

Tem um arquivo `projeto-jwt/src/tests/users_api_test.rest` com exemplos de como testar as rotas.

## Estrutura do Backend

O projeto usa arquitetura em camadas:

- **Routes:** Define as rotas da API
- **Controllers:** Recebe as requisições e retorna respostas
- **Services:** Contém a lógica de negócio
- **Models:** Faz as consultas no banco de dados

Tem 3 arquivos de rotas separados:

- `auth.routes.js` - Login
- `public.routes.js` - Rotas abertas (sem login)
- `protected.routes.js` - Rotas que precisam de autenticação

## O que foi implementado

- Login com JWT
- Controle de acesso por roles (admin/user)
- CRUD completo de eventos (criar, listar, editar, deletar)
- CRUD completo de voluntários (criar, listar, editar, deletar)
- Proteção de rotas por autenticação
- Autorização por role (admin tem acesso total, user só visualiza)
- Dashboard personalizado
- Validação de dados no backend
- Interface responsiva no frontend

## Páginas do Frontend

**Públicas:**

- Home
- Login
- Lista de Eventos

**Protegidas (precisa estar logado):**

- Dashboard
- Lista de Voluntários

**Só Admin:**

- Painel Admin
- Criar Evento
- Editar Evento
- Cadastrar Voluntário
- Editar Voluntário

## Testes

O projeto possui testes unitários, de integração e E2E implementados com **Jest** e **Supertest**.

### Rodando os testes

```bash
cd projeto-jwt

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E (end-to-end)
npm run test:e2e
```

**Sobre os testes:**

- **Testes unitários:** Testam funções e métodos isoladamente
- **Testes de integração:** Testam a integração entre diferentes módulos
- **Testes E2E:** Testam o fluxo completo da aplicação (incluindo testes de login com Selenium)

## Logging com Winston

O projeto utiliza **Winston** para logging estruturado. Os logs são salvos em:

- `logs/error.log` - Erros da aplicação
- `logs/combined.log` - Todos os logs

Os logs também aparecem no console durante o desenvolvimento.

**Níveis de log utilizados:**

- `error` - Erros e exceções
- `warn` - Avisos importantes
- `info` - Informações gerais (sucesso de operações, etc.)
- `http` - Requisições HTTP
- `debug` - Informações de debug

## Observações

- O token JWT expira em 24h (configurável no .env)
- Todas as senhas são criptografadas com bcrypt
- As validações acontecem tanto no frontend quanto no backend
- Se tentar acessar uma rota protegida sem login, é redirecionado pro login
- Se um usuário comum tentar acessar área de admin, aparece página "Acesso Negado"
- O projeto já está configurado com CORS pra aceitar requisições do frontend
- O Prisma gerencia automaticamente as migrations e sincronização do schema do banco
- Os logs são salvos automaticamente e ajudam no monitoramento e debugging da aplicação
