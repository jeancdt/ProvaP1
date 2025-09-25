const EventModel = require('../models/eventModel');

class EventService {
    static async listEvents() {
        const events = await EventModel.findAll();
        return events;
    }
}

module.exports = EventService; 