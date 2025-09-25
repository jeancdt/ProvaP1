const EventService = require('../services/eventService');

class EventsController {
    static async list(req, res) {
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
}

module.exports = EventsController; 