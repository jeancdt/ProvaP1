const EventModel = require('../models/eventModel');

class EventService {
    static async listEvents() {
        const events = await EventModel.findAll();
        return events;
    }

    static async createEvent(eventData) {
        const event = await EventModel.create(eventData);
        return event;
    }
}

module.exports = EventService; 