const express = require('express');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastro de novo usuário
 *     description: Registra um novo usuário no sistema
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário cadastrado com sucesso!"
 *       400:
 *         description: Email já cadastrado ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao cadastrar usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     description: Realiza o login de um usuário (comum ou administrador) e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email e senha são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Email ou senha incorretos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao fazer login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/login', AuthController.login);

module.exports = router;