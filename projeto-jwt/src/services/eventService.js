const EventModel = require("../models/eventModel");

class EventService {
  static async listEvents() {
    const events = await EventModel.findAll();
    return events;
  }

  static async getEventById(id) {
    const event = await EventModel.findById(id);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    return event;
  }

  static async createEvent(eventData) {
    const { title, start_date, end_date, volunteer_ids } = eventData;

    // Validações
    if (!title || title.trim() === "" || !start_date || !end_date) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (start_date > end_date || start_date === end_date) {
      throw new Error("A data de início não pode ser maior ou igual a data de término");
    }

    if (volunteer_ids.length < 1) {
      throw new Error("O evento deve ter no mínimo 1 voluntário");
    }

    if (volunteer_ids.length > 3) {
      throw new Error("O evento pode ter no máximo 3 voluntários");
    }

    const existingVolunteerIds = await EventModel.verifyVolunteersExist(volunteer_ids);

    if (existingVolunteerIds.length !== volunteer_ids.length) {
      throw new Error("Um ou mais voluntários fornecidos não existem");
    }

    const event = await EventModel.create(eventData);
    return event;
  }

  static async updateEvent(id, eventData) {
    const { title, start_date, end_date, volunteer_ids } = eventData;

    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }

    // Validações
    if (!title || title.trim() === "" || !start_date || !end_date) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (start_date > end_date || start_date === end_date) {
      throw new Error("A data de início não pode ser maior ou igual a data de término");
    }

    if (volunteer_ids.length < 1) {
      throw new Error("O evento deve ter no mínimo 1 voluntário");
    }

    if (volunteer_ids.length > 3) {
      throw new Error("O evento pode ter no máximo 3 voluntários");
    }

    const existingVolunteerIds = await EventModel.verifyVolunteersExist(volunteer_ids);

    if (existingVolunteerIds.length !== volunteer_ids.length) {
      throw new Error("Um ou mais voluntários fornecidos não existem");
    }

    const event = await EventModel.update(id, eventData);
    return event;
  }

  static async deleteEvent(id) {
    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }

    const deleted = await EventModel.delete(id);
    return deleted;
  }
}

module.exports = EventService;
