const VolunteerModel = require('../models/volunteerModel');

class VolunteerService {
    static async listVolunteers() {
        const volunteers = await VolunteerModel.findAll();
        return volunteers;
    }

    static async getVolunteerById(id) {
        const volunteer = await VolunteerModel.findById(id);
        if (!volunteer) {
            throw new Error('Voluntário não encontrado');
        }
        return volunteer;
    }

    static async createVolunteer(volunteerData) {
        const volunteer = await VolunteerModel.create(volunteerData);
        return volunteer;
    }

    static async updateVolunteer(id, volunteerData) {
        const updated = await VolunteerModel.update(id, volunteerData);
        if (!updated) {
            throw new Error('Voluntário não encontrado');
        }
        return { id, ...volunteerData };
    }

    static async deleteVolunteer(id) {
        const deleted = await VolunteerModel.delete(id);
        if (!deleted) {
            throw new Error('Voluntário não encontrado');
        }
        return { message: 'Voluntário excluído com sucesso' };
    }
}

module.exports = VolunteerService;