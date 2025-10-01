const EventService = require('../services/eventService');

class ProtectedController {
    static dashboard(req, res) {
        try {    
            return res.status(200).json({
                message: `Bem-vindo ao painel,
           ${req.user.email}`
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao acessar o painel', error:
                    error.message
            });
        }
    }

    static adminOnly(req, res) {
        try {
            return res.status(200).json({
                message: `Bem-vindo à área admin,
           ${req.user.email}`
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao acessar a área admin',
                error: error.message
            });
        }
    }

    static async createEvent(req, res) {
        try {
            const { title, description, location, start_date, end_date } = req.body;

            if (!title || !description || !location || !start_date || !end_date) {
                return res.status(400).json({
                    message: 'Todos os campos são obrigatórios'
                });
            }

            if (start_date > end_date || start_date === end_date) {
                return res.status(400).json({
                    message: 'A data de início não pode ser maior ou igual a data de término'
                });
            }

            const event = await EventService.createEvent(req.body);
            return res.status(201).json({
                message: 'Evento criado com sucesso',
                event
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao criar evento',
                error: error.message
            });
        }
    }
}

module.exports = ProtectedController;