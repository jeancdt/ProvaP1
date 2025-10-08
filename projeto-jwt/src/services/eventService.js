const EventModel = require("../models/eventModel");

/**
 * Service de eventos
 * Contém a lógica de negócio e validações
 * @class EventService
 */
class EventService {
  /**
   * Lista todos os eventos
   * @returns {Promise<Array>} Lista de eventos
   */
  static async listEvents() {
    const events = await EventModel.findAll();
    return events;
  }

  /**
   * Busca um evento por ID
   * @param {number} id - ID
   * @returns {Promise<Object>} Dados do evento
   * @throws {Error} Se o evento não for encontrado
   */
  static async getEventById(id) {
    const event = await EventModel.findById(id);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    return event;
  }

  /**
   * Cria novo evento
   * Valida todos os campos e verifica se os voluntários existem
   * @param {Object} eventData - Dados do evento
   * @param {string} eventData.title - Título
   * @param {string} eventData.description - Descrição
   * @param {string} eventData.location - Local
   * @param {string} eventData.start_date - Data de início
   * @param {string} eventData.end_date - Data de término
   * @param {Array<number>} eventData.volunteer_ids - IDs dos voluntários (mínimo 1, máximo 3)
   * @returns {Promise<Object>} Evento criado
   * @throws {Error} Se houver erro de validação
   */
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

  /**
   * Atualiza evento existente
   * Valida todos os campos e verifica se os voluntários existem
   * @param {number} id - ID do evento
   * @param {Object} eventData - Dados atualizados do evento
   * @param {string} eventData.title - Título
   * @param {string} eventData.description - Descrição
   * @param {string} eventData.location - Local
   * @param {string} eventData.start_date - Data de início
   * @param {string} eventData.end_date - Data de término
   * @param {Array<number>} eventData.volunteer_ids - IDs dos voluntários (mínimo 1, máximo 3)
   * @returns {Promise<Object>} Evento atualizado
   * @throws {Error} Se o evento não existir ou houver erro de validação
   */
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

  /**
   * Exclui evento
   * @param {number} id - ID
   * @returns {Promise<boolean>} true se o evento foi excluído
   * @throws {Error} Se o evento não for encontrado
   */
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
