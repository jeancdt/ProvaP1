const express = require('express');
const PublicController = require('../controllers/public.controller');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota pública HOME
 *     description: Retorna uma mensagem de boas-vindas da API pública
 *     tags: [Públicas]
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bem-vindo à API pública!"
 */
router.get('/', PublicController.home);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Listar todos os eventos
 *     description: Retorna a lista de todos os eventos cadastrados (rota pública)
 *     tags: [Públicas]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Erro ao buscar eventos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/events', PublicController.listEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Buscar evento específico por ID
 *     description: Retorna os detalhes de um evento específico (rota pública)
 *     tags: [Públicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *         example: 5
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Erro ao buscar evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/events/:id', PublicController.getEventById);

module.exports = router;