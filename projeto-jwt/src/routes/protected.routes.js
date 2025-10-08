const express = require("express");
const { authenticateToken, authorizeRole } = require("../middlewares/auth.middleware");
const ProtectedController = require("../controllers/protected.controller");
const router = express.Router();

/**
 * @swagger
 * /protected/dashboard:
 *   get:
 *     summary: Acesso ao painel
 *     description: Acessa o painel do usuário autenticado (requer token JWT)
 *     tags: [Protegidas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso ao dashboard permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bem-vindo ao painel!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "usuario@ifrs.edu.br"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Token expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get("/dashboard", authenticateToken, ProtectedController.dashboard);

/**
 * @swagger
 * /protected/admin:
 *   get:
 *     summary: Acesso à área admin
 *     description: Acessa a área administrativa (requer token JWT e role de admin)
 *     tags: [Protegidas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso à área admin permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Área exclusiva para administradores"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "admin@ifrs.edu.br"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get("/admin", authenticateToken, authorizeRole("admin"), ProtectedController.adminOnly);

// Rotas de Eventos

/**
 * @swagger
 * /protected/events:
 *   post:
 *     summary: Criar evento
 *     description: Cria um novo evento (requer token JWT e role de admin)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - start_date
 *               - volunteer_ids
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Evento Teste"
 *               description:
 *                 type: string
 *                 example: "Descrição do evento teste"
 *               location:
 *                 type: string
 *                 example: "Local do evento"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-15 09:00:00"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-15 17:00:00"
 *               volunteer_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *                 maxItems: 3
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento criado com sucesso!"
 *                 eventId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Dados inválidos ou número de voluntários fora do limite (1-3)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao criar evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post("/events", authenticateToken, authorizeRole("admin"), ProtectedController.createEvent);

/**
 * @swagger
 * /protected/events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     description: Atualiza um evento existente (requer token JWT e role de admin)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *         example: 6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Evento 2 - Totalmente Atualizado"
 *               description:
 *                 type: string
 *                 example: "Nova descrição completa"
 *               location:
 *                 type: string
 *                 example: "Novo Local"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-01 10:00:00"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-01 16:00:00"
 *               volunteer_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 minItems: 1
 *                 maxItems: 3
 *                 example: [1, 3]
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento atualizado com sucesso!"
 *       400:
 *         description: Dados inválidos ou número de voluntários fora do limite (1-3)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao atualizar evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.put("/events/:id", authenticateToken, authorizeRole("admin"), ProtectedController.updateEvent);

/**
 * @swagger
 * /protected/events/{id}:
 *   delete:
 *     summary: Excluir evento por ID
 *     description: Exclui um evento existente (requer token JWT e role de admin)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *         example: 6
 *     responses:
 *       200:
 *         description: Evento excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Evento excluído com sucesso!"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao excluir evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.delete("/events/:id", authenticateToken, authorizeRole("admin"), ProtectedController.deleteEvent);

// Rotas de Voluntários

/**
 * @swagger
 * /protected/volunteers:
 *   get:
 *     summary: Listar todos os voluntários
 *     description: Retorna a lista de todos os voluntários cadastrados (requer autenticação)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de voluntários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao buscar voluntários
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get("/volunteers", authenticateToken, ProtectedController.listVolunteers);

/**
 * @swagger
 * /protected/volunteers/{id}:
 *   get:
 *     summary: Buscar voluntário por ID
 *     description: Retorna os detalhes de um voluntário específico (requer autenticação)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalhes do voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Voluntário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao buscar voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get("/volunteers/:id", authenticateToken, ProtectedController.getVolunteerById);

/**
 * @swagger
 * /protected/volunteers:
 *   post:
 *     summary: Criar novo voluntário
 *     description: Cria um novo voluntário (requer token JWT e role de admin)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Voluntario teste"
 *               phone:
 *                 type: string
 *                 example: "(54) 99999-9999"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "voluntario@teste.com"
 *     responses:
 *       201:
 *         description: Voluntário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Voluntário criado com sucesso!"
 *                 volunteerId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao criar voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post("/volunteers", authenticateToken, authorizeRole("admin"), ProtectedController.createVolunteer);

/**
 * @swagger
 * /protected/volunteers/{id}:
 *   put:
 *     summary: Atualizar voluntário
 *     description: Atualiza um voluntário existente (requer token JWT e role de admin)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "VOLUNTARIO TESTE"
 *               phone:
 *                 type: string
 *                 example: "(54) 99999-8888"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "VOLUNTARIO@teste.com"
 *     responses:
 *       200:
 *         description: Voluntário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Voluntário atualizado com sucesso!"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Voluntário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao atualizar voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.put("/volunteers/:id", authenticateToken, authorizeRole("admin"), ProtectedController.updateVolunteer);

/**
 * @swagger
 * /protected/volunteers/{id}:
 *   delete:
 *     summary: Excluir voluntário por ID
 *     description: Exclui um voluntário existente (requer token JWT e role de admin)
 *     tags: [Voluntários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *         example: 1
 *     responses:
 *       200:
 *         description: Voluntário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Voluntário excluído com sucesso!"
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Voluntário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao excluir voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.delete("/volunteers/:id", authenticateToken, authorizeRole("admin"), ProtectedController.deleteVolunteer);

module.exports = router;
