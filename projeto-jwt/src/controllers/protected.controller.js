const EventService = require("../services/eventService");

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
}

module.exports = ProtectedController;
