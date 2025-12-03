const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const logger = require("./src/config/logger.config");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const publicRoutes = require("./src/routes/public.routes");
const protectedRoutes = require("./src/routes/protected.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Config CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware de logging HTTP
app.use(logger.httpLogger);

app.use(express.json());

// --- Config Swagger/OpenAPI ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Eventos, Voluntários e Autenticação",
      version: "1.0.0",
      description: "API para gerenciamento de eventos e voluntários com autenticação JWT e integração MySQL.",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT para autenticação",
        },
      },
      schemas: {
        UserRegister: {
          type: "object",
          required: ["email", "password", "role"],
          properties: {
            email: { type: "string", format: "email", example: "novo@ifrs.edu.br" },
            password: { type: "string", format: "password", example: "senha123" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "usuario@ifrs.edu.br" },
            password: { type: "string", format: "password", example: "senha123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Login bem-sucedido!" },
            token: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
            user: {
              type: "object",
              properties: {
                email: { type: "string", example: "usuario@ifrs.edu.br" },
                role: { type: "string", example: "user" },
              },
            },
          },
        },
        Event: {
          type: "object",
          required: ["title", "description", "location", "start_date", "volunteer_ids"],
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Evento de Natal" },
            description: { type: "string", example: "Evento beneficente de Natal" },
            location: { type: "string", example: "Salão Comunitário" },
            start_date: { type: "string", format: "date-time", example: "2025-12-25T09:00:00" },
            end_date: { type: "string", format: "date-time", example: "2025-12-25T17:00:00" },
            volunteer_ids: {
              type: "array",
              items: { type: "integer" },
              minItems: 1,
              maxItems: 3,
              example: [1, 2, 3],
              description: "Lista de IDs dos voluntários (mínimo 1, máximo 3)",
            },
            volunteers: { type: "string", example: "João Silva, Maria Santos, Pedro Oliveira" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Volunteer: {
          type: "object",
          required: ["name", "phone"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "João Silva" },
            phone: { type: "string", example: "(54) 99999-9999" },
            email: { type: "string", format: "email", example: "joao@email.com" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        ErrorMessage: {
          type: "object",
          properties: {
            message: { type: "string", example: "Erro ao processar requisição" },
            error: { type: "string", example: "Detalhes do erro" },
          },
        },
      },
    },
    tags: [
      { name: "Públicas", description: "Rotas públicas sem autenticação" },
      { name: "Autenticação", description: "Rotas de registro e login" },
      { name: "Protegidas", description: "Rotas que requerem autenticação" },
      { name: "Eventos", description: "Gerenciamento de eventos" },
      { name: "Voluntários", description: "Gerenciamento de voluntários" },
    ],
  },
  apis: ["./server.js", "./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/", publicRoutes);
app.use("/protected", protectedRoutes);

app.listen(PORT, () => {
  logger.info(`API em http://localhost:${PORT}`);
  logger.info(`Doc Swagger em http://localhost:${PORT}/api-docs`);
});
