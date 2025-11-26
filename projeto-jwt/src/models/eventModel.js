const prisma = require("../config/prismaClient");

/**
 * Model de eventos
 * @class EventModel
 */
class EventModel {
  /**
   * Busca todos os eventos ordenados por data de início
   * Inclui os nomes dos voluntários
   * @returns {Promise<Array>} Lista de eventos com voluntários
   */
  static async findAll() {
    const events = await prisma.event.findMany({
      orderBy: {
        start_date: "asc",
      },
      include: {
        volunteers: {
          include: {
            volunteer: true,
          },
        },
      },
    });

    // Formatar os eventos para incluir os nomes dos voluntários como string
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start_date: event.start_date,
      end_date: event.end_date,
      volunteers: event.volunteers.map((ev) => ev.volunteer.name).join(", "),
    }));
  }

  /**
   * Busca um evento por ID
   * Inclui os nomes e IDs dos voluntários
   * @param {number} id - ID
   * @returns {Promise<Object|null>} Objeto ou null se não encontrado
   */
  static async findById(id) {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        volunteers: {
          include: {
            volunteer: true,
          },
        },
      },
    });

    if (!event) {
      return null;
    }

    // Formatar o evento incluindo os voluntários
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start_date: event.start_date,
      end_date: event.end_date,
      volunteers: event.volunteers.map((ev) => ev.volunteer.name).join(", "),
      volunteer_ids: event.volunteers.map((ev) => ev.volunteer.id),
    };
  }

  /**
   * Cria um novo evento
   * Associa os voluntários ao evento criado
   * @param {Object} eventData - Dados do evento
   * @param {string} eventData.title - Título
   * @param {string} eventData.description - Descrição
   * @param {string} eventData.location - Local
   * @param {string} eventData.start_date - Data de início
   * @param {string} eventData.end_date - Data de término
   * @param {Array<number>} eventData.volunteer_ids - IDs dos voluntários
   * @returns {Promise<Object>} Evento criado com todos
   */
  static async create(eventData) {
    const { title, description, location, start_date, end_date, volunteer_ids } = eventData;

    // Criar o evento com as associações de voluntários em uma transação
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        volunteers:
          volunteer_ids && volunteer_ids.length > 0
            ? {
                create: volunteer_ids.map((volunteerId) => ({
                  volunteer: {
                    connect: { id: volunteerId },
                  },
                })),
              }
            : undefined,
      },
    });

    return await this.findById(event.id);
  }

  /**
   * Atualiza evento existente
   * Remove e recria as associações com voluntários
   * @param {number} id - ID
   * @param {Object} eventData - Dados atualizados
   * @param {string} eventData.title - Título
   * @param {string} eventData.description - Descrição
   * @param {string} eventData.location - Local
   * @param {string} eventData.start_date - Data de início
   * @param {string} eventData.end_date - Data de término
   * @param {Array<number>} eventData.volunteer_ids - IDs dos voluntários
   * @returns {Promise<Object>} Evento atualizado com todos os dados
   */
  static async update(id, eventData) {
    const { title, description, location, start_date, end_date, volunteer_ids } = eventData;

    // Usar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      // Atualizar o evento
      await tx.event.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          location,
          start_date: new Date(start_date),
          end_date: end_date ? new Date(end_date) : null,
        },
      });

      // Se volunteer_ids foi fornecido, atualizar as associações
      if (volunteer_ids !== undefined) {
        // Remover todas as associações existentes
        await tx.eventVolunteer.deleteMany({
          where: { event_id: parseInt(id) },
        });

        // Criar novas associações
        if (volunteer_ids.length > 0) {
          await tx.eventVolunteer.createMany({
            data: volunteer_ids.map((volunteerId) => ({
              event_id: parseInt(id),
              volunteer_id: volunteerId,
            })),
          });
        }
      }
    });

    return await this.findById(id);
  }

  /**
   * Exclui um evento
   * As associações com voluntários são removidas automaticamente (CASCADE)
   * @param {number} id - ID
   * @returns {Promise<boolean>} true se o evento foi excluído
   */
  static async delete(id) {
    try {
      await prisma.event.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica quais voluntários existem
   * @param {Array<number>} volunteerIds - Lista de IDs de voluntários
   * @returns {Promise<Array<number>>} Lista de IDs que existem
   */
  static async verifyVolunteersExist(volunteerIds) {
    if (!volunteerIds || volunteerIds.length === 0) {
      return [];
    }

    const volunteers = await prisma.volunteer.findMany({
      where: {
        id: {
          in: volunteerIds,
        },
      },
      select: {
        id: true,
      },
    });

    return volunteers.map((v) => v.id);
  }
}

module.exports = EventModel;
