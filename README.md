# Sistema de Voluntariado IFRS

Prova P1

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Usuários de Teste](#-usuários-de-teste)
- [API Endpoints](#-api-endpoints)
- [Testes](#-testes)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)

## 🎯 Visão Geral

Este projeto implementa um sistema básico de gerenciamento de eventos com:
- Autenticação e autorização baseada em JWT
- Controle de acesso por roles (admin/user)
- Gerenciamento de eventos
- Arquitetura em camadas (Model-Service-Controller)

## 🚀 Tecnologias

### Backend (`projeto-jwt/`)
- **Node.js** + **Express**
- **MySQL**
- **JWT**
- **Bcrypt**
- **dotenv**
- **Nodemon**

### Frontend (`front-auth/`)
- **React**
- **Vite**
- **React Router**
- **Axios**
- **Context API**

## ✅ Pré-requisitos

Certifique-se de ter instalado:
- **Node.js**
- **npm** ou **yarn**
- **MySQL**
- **Git**

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
```

### 2. Instale as dependências do Backend

```bash
cd projeto-jwt
npm install
```

### 3. Instale as dependências do Frontend

```bash
cd ../front-auth
npm install
```

## ⚙️ Configuração

### 1. Configure o Banco de Dados MySQL

Abra o MySQL Workbench/phpMyAdmin e execute o conteúdo do arquivo `projeto-jwt/db.sql`.

### 2. Configure as Variáveis de Ambiente do Backend

Crie um arquivo `.env` na pasta `projeto-jwt/`:

Adicione as seguintes variáveis:

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

**Importante:** Altere as variáveis com seus próprios valores.

### 3. Configure a URL da API no Frontend

No arquivo `front-auth/src/api/http.js`, verifique se a `baseURL` está correta:

```javascript
baseURL: 'http://localhost:3000'
```

## 🎮 Executando o Projeto

### Backend

```bash
cd projeto-jwt
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

### Frontend

Em outro terminal:

```bash
cd front-auth
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173** (ou a porta exibida no terminal)

## 👥 Usuários de Teste

O banco de dados vem com dois usuários pré-cadastrados:

| Email                  | Senha    | Role  | Permissões                |
|------------------------|----------|-------|---------------------------|
| usuario@ifrs.edu.br    | 123456   | user  | Visualizar eventos        |
| admin@ifrs.edu.br      | admin123 | admin | Todas + Criar eventos     |

## 🔌 API Endpoints

### Autenticação

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@ifrs.edu.br",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@ifrs.edu.br",
    "role": "admin"
  }
}
```

### Rotas Públicas

```http
GET /events                    # Lista todos os eventos
```

### Rotas Protegidas (Requer Token)

```http
GET /dashboard                 # Dashboard do usuário autenticado
Authorization: Bearer {token}
```

### Rotas Admin (Requer Role Admin)

```http
POST /events                   # Criar novo evento
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Campanha de Doação de Sangue",
  "description": "Doe sangue e salve vidas",
  "location": "Campus Porto Alegre",
  "start_date": "2025-11-01 09:00:00",
  "end_date": "2025-11-01 17:00:00"
}
```

## 🧪 Testes

### Testes da API (REST Client)

O projeto inclui um arquivo `projeto-jwt/src/tests/users_api_test.rest` com exemplos de requisições.

Para usar:
1. Instale a extensão **REST Client** no VS Code (ou outro editor)
2. Abra o arquivo `.rest`
3. Clique em "Send Request" acima de cada requisição

## 🏗️ Arquitetura

O backend segue a arquitetura em camadas:

```
┌─────────────────┐
│     Routes      │  ← Define endpoints e métodos HTTP
└────────┬────────┘
         │
┌────────▼────────┐
│   Controllers   │  ← Recebe requisições, valida entrada
└────────┬────────┘
         │
┌────────▼────────┐
│    Services     │  ← Regras de negócio e lógica
└────────┬────────┘
         │
┌────────▼────────┐
│     Models      │  ← Acesso ao banco de dados
└─────────────────┘
```

### Princípios Aplicados

- ✅ **Clean Code**
- ✅ **SOLID**
- ✅ **RESTful API**

## ✨ Funcionalidades

### Implementadas ✅

- [x] Autenticação com JWT
- [x] Controle de acesso baseado em roles
- [x] CRUD de eventos
- [x] Proteção de rotas no frontend
- [x] Dashboard para usuários autenticados
- [x] Painel administrativo
- [x] Logout seguro
- [x] Feedback visual (mensagens de erro/sucesso)
- [x] Formulários validados

### Frontend

- **Páginas Públicas:**
  - Home (`/`)
  - Login (`/login`)
  - Lista de Eventos (`/events`)

- **Páginas Protegidas:**
  - Dashboard (`/dashboard`) - Requer autenticação
  - Admin (`/admin`) - Requer role admin
  - Criar Evento (`/create-event`) - Requer role admin

### Frontend

Recomendações para deploy:
- **Vercel**, **Netlify** ou **Cloudflare Pages**
- Configure a variável de ambiente da API
- Build command: `npm run build`
- Output directory: `dist`