const EventService = require("../services/eventService");
const VolunteerService = require("../services/volunteerService");
const logger = require("../config/logger.config");

/**
 * Controller para rotas protegidas (requer autenticação)
 * @class ProtectedController
 */
class ProtectedController {
  /**
   * Acessa o painel do usuário autenticado
   * @param {Object} req - Objeto de requisição
   * @param {Object} req.user - Dados do usuário autenticado (injetado pelo middleware)
   * @param {string} req.user.email - Email do usuário
   * @param {Object} res - Objeto de resposta
   * @returns {Object} JSON com mensagem de boas-vindas
   */
  static dashboard(req, res) {
    try {
      logger.info(`Acesso ao dashboard - User: ${req.user.email}`);
      return res.status(200).json({
        message: `Bem-vindo ao painel,
           ${req.user.email}`,
      });
    } catch (error) {
      logger.error(`Erro ao acessar dashboard - User: ${req.user.email}`, { stack: error.stack });
      return res.status(500).json({
        message: "Erro ao acessar o painel",
        error: error.message,
      });
    }
  }

  /**
   * Acessa a área administrativa (apenas para admins)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.user - Dados do usuário autenticado (middleware)
   * @param {string} req.user.email - Email do usuário
   * @param {Object} res - Objeto de resposta
   * @returns {Object} JSON com mensagem de boas-vindas
   */
  static adminOnly(req, res) {
    try {
      logger.info(`Acesso à área admin - User: ${req.user.email}`);
      return res.status(200).json({
        message: `Bem-vindo à área admin,
           ${req.user.email}`,
      });
    } catch (error) {
      logger.error(`Erro ao acessar área admin - User: ${req.user.email}`, { stack: error.stack });
      return res.status(500).json({
        message: "Erro ao acessar a área admin",
        error: error.message,
      });
    }
  }

  /**
   * Cria novo evento (apenas admins)
   * @param {Object} req - Objeto de requisição
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.title - Título
   * @param {string} req.body.description - Descrição
   * @param {string} req.body.location - Local
   * @param {string} req.body.start_date - Data de início
   * @param {string} req.body.end_date - Data de término
   * @param {Array<number>} req.body.volunteer_ids - IDs dos voluntários
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<Object>} JSON com evento criado
   */
  static async createEvent(req, res) {
    try {
      logger.info(`Criando evento - Título: ${req.body.title}`);
      const event = await EventService.createEvent(req.body);
      logger.info(`Evento criado com sucesso - ID: ${event.id}, Título: ${event.title}`);
      return res.status(201).json({
        message: "Evento criado com sucesso",
        event,
      });
    } catch (error) {
      logger.error(`Erro ao criar evento - ${error.message}`, { stack: error.stack });
      return res.status(400).json({
        message: "Erro ao criar evento",
        error: error.message,
      });
    }
  }

  /**
   * Atualiza evento existente (apenas admins)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID
   * @param {Object} req.body - Corpo da requisição com dados atualizados
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<Object>} JSON com evento atualizado
   */
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Atualizando evento - ID: ${id}`);

      const event = await EventService.updateEvent(id, req.body);
      logger.info(`Evento atualizado com sucesso - ID: ${id}`);
      return res.status(200).json({
        message: "Evento atualizado com sucesso",
        event,
      });
    } catch (error) {
      const statusCode = error.message === "Evento não encontrado" ? 404 : 400;
      logger.error(`Erro ao atualizar evento - ID: ${req.params.id} - ${error.message}`);
      return res.status(statusCode).json({
        message: "Erro ao atualizar evento",
        error: error.message,
      });
    }
  }

  /**
   * Exclui evento (apenas admins)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID
   * @param {Object} res - Objeto de resposta Express
   * @returns {Promise<Object>} JSON com mensagem de sucesso
   */
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Excluindo evento - ID: ${id}`);
      await EventService.deleteEvent(id);
      logger.info(`Evento excluído com sucesso - ID: ${id}`);
      return res.status(200).json({
        message: "Evento excluído com sucesso",
      });
    } catch (error) {
      const statusCode = error.message === "Evento não encontrado" ? 404 : 500;
      logger.error(`Erro ao excluir evento - ID: ${req.params.id} - ${error.message}`);
      return res.status(statusCode).json({
        message: "Erro ao excluir evento",
        error: error.message,
      });
    }
  }

  // ========================================
  // MÉTODOS DE VOLUNTÁRIOS
  // ========================================

  /**
   * Lista todos os voluntários (requer autenticação)
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Object>} JSON com lista de voluntários
   */
  static async listVolunteers(req, res) {
    try {
      logger.info("Listando voluntários");
      const volunteers = await VolunteerService.listVolunteers();
      return res.status(200).json({
        message: "Lista de voluntários",
        volunteers,
      });
    } catch (error) {
      logger.error(`Erro ao listar voluntários - ${error.message}`, { stack: error.stack });
      return res.status(500).json({
        message: "Erro ao listar voluntários",
        error: error.message,
      });
    }
  }

  /**
   * Busca voluntário por ID (requer autenticação)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Object>} JSON com dados do voluntário
   */
  static async getVolunteerById(req, res) {
    try {
      const { id } = req.params;
      const volunteer = await VolunteerService.getVolunteerById(id);
      return res.status(200).json({
        message: "Voluntário encontrado",
        volunteer,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Voluntário não encontrado",
        error: error.message,
      });
    }
  }

  /**
   * Cria novo voluntário (apenas admins)
   * Valida nome, telefone e email
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Corpo da requisição
   * @param {string} req.body.name - Nome
   * @param {string} req.body.phone - Telefone
   * @param {string} [req.body.email] - Email (opcional)
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Object>} JSON com voluntário criado
   */
  static async createVolunteer(req, res) {
    try {
      const { name, phone, email } = req.body;

      // Validação dos campos obrigatórios
      if (!name || !phone) {
        return res.status(400).json({
          message: "Nome e telefone são obrigatórios",
        });
      }

      // Validação email (se fornecido)
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            message: "Email inválido",
          });
        }
      }

      // Validação telefone
      const phoneRegex = /^[\d\s-()]+$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Telefone inválido",
        });
      }

      const volunteer = await VolunteerService.createVolunteer(req.body);
      logger.info(`Voluntário criado com sucesso - ID: ${volunteer.id}, Nome: ${volunteer.name}`);
      return res.status(201).json({
        message: "Voluntário criado com sucesso",
        volunteer,
      });
    } catch (error) {
      logger.error(`Erro ao criar voluntário - ${error.message}`, { stack: error.stack });
      return res.status(500).json({
        message: "Erro ao criar voluntário",
        error: error.message,
      });
    }
  }

  /**
   * Atualiza voluntário existente (apenas admins)
   * Valida nome, telefone e email
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID
   * @param {Object} req.body - Corpo da requisição com dados atualizados
   * @param {string} req.body.name - Nome
   * @param {string} req.body.phone - Telefone
   * @param {string} [req.body.email] - Email (opcional)
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Object>} JSON com voluntário atualizado
   */
  static async updateVolunteer(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, email } = req.body;

      // Validação dos campos obrigatórios
      if (!name || !phone) {
        return res.status(400).json({
          message: "Nome e telefone são obrigatórios",
        });
      }

      // Validação email (se fornecido)
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            message: "Email inválido",
          });
        }
      }

      // Validação telefone
      const phoneRegex = /^[\d\s-()]+$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Telefone inválido",
        });
      }

      const volunteer = await VolunteerService.updateVolunteer(id, req.body);
      return res.status(200).json({
        message: "Voluntário atualizado com sucesso",
        volunteer,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Erro ao atualizar voluntário",
        error: error.message,
      });
    }
  }

  /**
   * Exclui voluntário (apenas admins)
   * @param {Object} req - Objeto de requisição
   * @param {Object} req.params - Parâmetros da URL
   * @param {string} req.params.id - ID
   * @param {Object} res - Objeto de resposta
   * @returns {Promise<Object>} JSON com mensagem de sucesso
   */
  static async deleteVolunteer(req, res) {
    try {
      const { id } = req.params;
      const result = await VolunteerService.deleteVolunteer(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({
        message: "Erro ao excluir voluntário",
        error: error.message,
      });
    }
  }
}

module.exports = ProtectedController;
