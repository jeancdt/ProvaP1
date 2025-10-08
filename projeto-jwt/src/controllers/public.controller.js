const EventService = require("../services/eventService");

/**
 * Controller para rotas públicas (sem autenticação)
 * @class PublicController
 */
class PublicController {
  /**
   * Rota inicial da API pública
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   * @returns {Object} Mensagem de boas-vindas
   */
  static home(req, res) {
    try {
      return res.status(200).send("Bem-vindo à API pública!");
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao acessar a rota pública",
        error: error.message,
      });
    }
  }

  /**
   * Lista todos os eventos (acesso público)
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Array>} JSON com lista de eventos
   */
  static async listEvents(req, res) {
    try {
      const events = await EventService.listEvents();
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar eventos",
        error: error.message,
      });
    }
  }

  /**
   * Busca evento por ID (acesso público)
   * @param {Object} req - Objeto de requisição
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Object>} JSON com dados do evento
   */
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      return res.status(200).json(event);
    } catch (error) {
      const statusCode = error.message === "Evento não encontrado" ? 404 : 500;
      return res.status(statusCode).json({
        message: "Erro ao buscar evento",
        error: error.message,
      });
    }
  }
}

module.exports = PublicController;
