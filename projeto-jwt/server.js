const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
    origin: 'http://localhost:5173', // URL do frontend Vite
    credentials: true
}));

app.use(express.json());

// --- Configuração do Banco de Dados MySQL ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// --- Middleware de Autenticação JWT ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token não fornecido" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
        req.user = user;
        next();
    });
}

// --- Middleware de Autorização (Roles) ---
function authorizeRole(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acesso negado: Você não tem permissão." });
        }
        next();
    };
}

// --- Configuração do Swagger/OpenAPI (Mínima) ---
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Eventos e Autenticação",
            version: "1.0.0",
            description: "API para gerenciamento de eventos com autenticação JWT e integração MySQL.",
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
                        password: { type: "string", format: "password", example: "123456" },
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
                                role: { type: "string", example: "user" }
                            }
                        }
                    },
                },
                Event: {
                    type: "object",
                    required: ["title", "description", "location", "start_date"],
                    properties: {
                        id: { type: "integer", readOnly: true, example: 1 },
                        title: { type: "string", example: "Conferência de Tecnologia" },
                        description: { type: "string", example: "Um evento de tecnologia." },
                        location: { type: "string", example: "Centro de Convenções" },
                        start_date: { type: "string", format: "date-time", example: "2025-10-15 09:00:00" },
                        end_date: { type: "string", format: "date-time", example: "2025-10-15 17:00:00" },
                        created_at: { type: "string", format: "date-time", readOnly: true, example: "2024-01-01T10:00:00Z" }
                    },
                },
                ErrorMessage: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Erro interno do servidor." },
                    },
                },
            },
        },
    },
    apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Rotas da API ---

/**
 * @openapi
 * /:
 *   get:
 *     tags: [Públicas]
 *     summary: Rota HOME
 *     responses:
 *       200:
 *         description: Sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bem-vindo à API de Eventos!"
 */
app.get("/", (req, res) => {
    res.json({ message: "Bem-vindo à API de Eventos!" });
});

/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Eventos]
 *     summary: Lista todos os eventos
 *     responses:
 *       200:
 *         description: Lista de eventos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
app.get("/events", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, title, description, location, start_date, end_date, created_at FROM events");
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário registrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário registrado com sucesso."
 *       400:
 *         description: Dados inválidos ou usuário já existe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
app.post("/auth/register", async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, senha e role são obrigatórios." });
    }

    try {
        const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Usuário com este email já existe." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, role]);
        res.status(201).json({ message: "Usuário registrado com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query("SELECT id, email, password, role FROM users WHERE email = ?", [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        
        // Retorna o token e as informações do usuário (sem a senha)
        res.json({ 
            message: "Login bem-sucedido!", 
            token,
            user: {
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

/**
 * @openapi
 * /protected/dashboard:
 *   get:
 *     tags: [Protegidas]
 *     summary: Painel do usuário (requer autenticação)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Acesso permitido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: "string", example: "Bem-vindo ao seu painel, usuario@ifrs.edu.br!" }
 *                 user:
 *                   type: object
 *                   properties:
 *                     email: { type: "string", example: "usuario@ifrs.edu.br" }
 *                     role: { type: "string", example: "user" }
 *       401:
 *         description: Não autorizado (token ausente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Proibido (token inválido/expirado).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
app.get("/protected/dashboard", authenticateToken, (req, res) => {
    res.json({ message: `Bem-vindo ao seu painel, ${req.user.email}!`, user: req.user });
});

/**
 * @openapi
 * /protected/admin:
 *   get:
 *     tags: [Protegidas]
 *     summary: Área de administrador (requer role 'admin')
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Acesso permitido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: "string", example: "Bem-vindo à área de administração, admin@ifrs.edu.br!" }
 *                 user:
 *                   type: object
 *                   properties:
 *                     email: { type: "string", example: "admin@ifrs.edu.br" }
 *                     role: { type: "string", example: "admin" }
 *       401:
 *         description: Não autorizado (token ausente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Proibido (token inválido/expirado ou role insuficiente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
app.get("/protected/admin", authenticateToken, authorizeRole(["admin"]), (req, res) => {
    res.json({ message: `Bem-vindo à área de administração, ${req.user.email}!`, user: req.user });
});

/**
 * @openapi
 * /protected/events:
 *   post:
 *     tags: [Eventos, Protegidas]
 *     summary: Cria um novo evento (somente para administradores)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Dados do evento inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Não autorizado (token ausente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Proibido (token inválido/expirado ou role insuficiente).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro interno.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
app.post("/protected/events", authenticateToken, authorizeRole(["admin"]), async (req, res) => {
    const { title, description, location, start_date, end_date } = req.body;
    if (!title || !description || !location || !start_date) {
        return res.status(400).json({ message: "Título, descrição, local e data de início são obrigatórios." });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO events (title, description, location, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
            [title, description, location, start_date, end_date || null]
        );

        const newEvent = {
            id: result.insertId,
            title,
            description,
            location,
            start_date,
            end_date,
            created_at: new Date().toISOString()
        };
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// --- Inicia o servidor ---
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});