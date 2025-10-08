const EventService = require("../services/eventService");
const VolunteerService = require('../services/volunteerService');

class ProtectedController {
  static dashboard(req, res) {
    try {
      return res.status(200).json({
        message: `Bem-vindo ao painel,
           ${req.user.email}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao acessar o painel",
        error: error.message,
      });
    }
  }

  static adminOnly(req, res) {
    try {
      return res.status(200).json({
        message: `Bem-vindo à área admin,
           ${req.user.email}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao acessar a área admin",
        error: error.message,
      });
    }
  }

  static async createEvent(req, res) {
    try {
      const event = await EventService.createEvent(req.body);
      return res.status(201).json({
        message: "Evento criado com sucesso",
        event,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Erro ao criar evento",
        error: error.message,
      });
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await EventService.updateEvent(id, req.body);
      return res.status(200).json({
        message: "Evento atualizado com sucesso",
        event,
      });
    } catch (error) {
      const statusCode = error.message === "Evento não encontrado" ? 404 : 400;
      return res.status(statusCode).json({
        message: "Erro ao atualizar evento",
        error: error.message,
      });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      return res.status(200).json({
        message: "Evento excluído com sucesso",
      });
    } catch (error) {
      const statusCode = error.message === "Evento não encontrado" ? 404 : 500;
      return res.status(statusCode).json({
        message: "Erro ao excluir evento",
        error: error.message,
      });
    }
  }

  // ========================================
  // MÉTODOS DE VOLUNTÁRIOS
  // ========================================

  // Listar voluntários
  static async listVolunteers(req, res) {
    try {
      const volunteers = await VolunteerService.listVolunteers();
      return res.status(200).json({
        message: 'Lista de voluntários',
        volunteers
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar voluntários',
        error: error.message
      });
    }
  }

  // Buscar voluntário por ID
  static async getVolunteerById(req, res) {
    try {
      const { id } = req.params;
      const volunteer = await VolunteerService.getVolunteerById(id);
      return res.status(200).json({
        message: 'Voluntário encontrado',
        volunteer
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Voluntário não encontrado',
        error: error.message
      });
    }
  }

  // Criar voluntário
  static async createVolunteer(req, res) {
    try {
      const { name, phone, email } = req.body;

      // Validação dos campos obrigatórios
      if (!name || !phone) {
        return res.status(400).json({
          message: 'Nome e telefone são obrigatórios'
        });
      }

      // Validação email (se fornecido)
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            message: 'Email inválido'
          });
        }
      }

      // Validação telefone
      const phoneRegex = /^[\d\s-()]+$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: 'Telefone inválido'
        });
      }

      const volunteer = await VolunteerService.createVolunteer(req.body);
      return res.status(201).json({
        message: 'Voluntário criado com sucesso',
        volunteer
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao criar voluntário',
        error: error.message
      });
    }
  }

  // Atualizar voluntário
  static async updateVolunteer(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, email } = req.body;

      // Validação dos campos obrigatórios
      if (!name || !phone) {
        return res.status(400).json({
          message: 'Nome e telefone são obrigatórios'
        });
      }

      // Validação email (se fornecido)
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            message: 'Email inválido'
          });
        }
      }

      // Validação telefone
      const phoneRegex = /^[\d\s-()]+$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: 'Telefone inválido'
        });
      }

      const volunteer = await VolunteerService.updateVolunteer(id, req.body);
      return res.status(200).json({
        message: 'Voluntário atualizado com sucesso',
        volunteer
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Erro ao atualizar voluntário',
        error: error.message
      });
    }
  }

  // Excluir voluntário
  static async deleteVolunteer(req, res) {
    try {
      const { id } = req.params;
      const result = await VolunteerService.deleteVolunteer(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({
        message: 'Erro ao excluir voluntário',
        error: error.message
      });
    }
  }
}

module.exports = ProtectedController;
