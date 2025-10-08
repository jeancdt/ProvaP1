const EventService = require('../services/eventService');

class PublicController {
    static home(req, res) {
        try {
            return res.status(200).send('Bem-vindo à API pública!');
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao acessar a rota pública',
                error: error.message
            });
        }
    }

    static async listEvents(req, res) {
        try {
            const events = await EventService.listEvents();
            return res.status(200).json(events);
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao listar eventos',
                error: error.message
            });
        }
    }

    static async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await EventService.getEventById(id);
            return res.status(200).json(event);
        } catch (error) {
            const statusCode = error.message === 'Evento não encontrado' ? 404 : 500;
            return res.status(statusCode).json({
                message: 'Erro ao buscar evento',
                error: error.message
            });
        }
    }
}

module.exports = PublicController;
