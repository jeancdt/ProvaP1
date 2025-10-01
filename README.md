# Sistema de Voluntariado IFRS

Prova P1 - Desenvolvimento Web

## Sobre o Projeto

Sistema para gerenciar eventos. Foi desenvolvido usando Node.js no backend e React no frontend.

Principais funcionalidades:
- Login com JWT
- Controle de usuários (admin e user)
- Cadastro e listagem de eventos
- Arquitetura em camadas (Model-Service-Controller)

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
- **Admin:** admin@ifrs.edu.br / admin123

## Principais Rotas da API

**Login:**
```
POST /auth/login
```

**Listar eventos (pública):**
```
GET /events
```

**Dashboard (precisa estar logado):**
```
GET /dashboard
```

**Criar evento (só admin):**
```
POST /events
```

Tem um arquivo `projeto-jwt/src/tests/users_api_test.rest` com exemplos de como testar as rotas.

## Estrutura do Backend

O projeto usa arquitetura em camadas:

- **Routes:** Define as rotas da API
- **Controllers:** Recebe as requisições e retorna respostas
- **Services:** Contém a lógica de negócio
- **Models:** Faz as consultas no banco de dados

## O que foi implementado

- Login com JWT
- Controle de usuários (admin/user)
- Listar eventos
- Criar eventos (só admin)
- Proteção de rotas
- Dashboard

## Páginas do Frontend

**Públicas:**
- Home
- Login  
- Lista de Eventos

**Protegidas:**
- Dashboard (precisa login)
- Admin (só admin)
- Criar Evento (só admin)