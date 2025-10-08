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
- JWT para autenticação
- Bcrypt para criptografia de senhas

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

### 2. Configure o Banco de Dados

Abra o MySQL Workbench ou phpMyAdmin e execute o arquivo `projeto-jwt/db.sql`

### 3. Configure o arquivo .env

Crie um arquivo `.env` dentro da pasta `projeto-jwt/` com:

```env
# Servidor
PORT=3000

# Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=projeto_jwt_db
DB_PORT=sua_porta

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

## Observações

- O token JWT expira em 24h (configurável no .env)
- Todas as senhas são criptografadas com bcrypt
- As validações acontecem tanto no frontend quanto no backend
- Se tentar acessar uma rota protegida sem login, é redirecionado pro login
- Se um usuário comum tentar acessar área de admin, aparece página "Acesso Negado"
- O projeto já está configurado com CORS pra aceitar requisições do frontend