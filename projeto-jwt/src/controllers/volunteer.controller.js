const VolunteerService = require('../services/volunteerService');

class VolunteerController {
    // Listar voluntários
    static async listVolunteers(req, res) {
        try {
            const volunteers = await VolunteerService.listVolunteers();
            return res.status(200).json({
                message: 'Lista de voluntários',
                volunteers
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao listar voluntários',
                error: error.message
            });
        }
    }

    // Buscar por ID
    static async getVolunteerById(req, res) {
        try {
            const { id } = req.params;
            const volunteer = await VolunteerService.getVolunteerById(id);
            return res.status(200).json({
                message: 'Voluntário encontrado',
                volunteer
            });
        } catch (error) {
            return res.status(404).json({
                message: 'Voluntário não encontrado',
                error: error.message
            });
        }
    }

    // Criar voluntário
    static async createVolunteer(req, res) {
        try {
            const { name, phone, email } = req.body;

            // Validação dos campos obrigatórios
            if (!name || !phone || !email) {
                return res.status(400).json({
                    message: 'Todos os campos são obrigatórios (name, phone, email)'
                });
            }

            // Validação email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: 'Email inválido'
                });
            }

            // Validação telefone
            const phoneRegex = /^[\d\s-()]+$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: 'Telefone inválido'
                });
            }

            const volunteer = await VolunteerService.createVolunteer(req.body);
            return res.status(201).json({
                message: 'Voluntário criado com sucesso',
                volunteer
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao criar voluntário',
                error: error.message
            });
        }
    }

    // Atualizar voluntário
    static async updateVolunteer(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, email } = req.body;

            // Validação dos campos obrigatórios
            if (!name || !phone || !email) {
                return res.status(400).json({
                    message: 'Todos os campos são obrigatórios (name, phone, email)'
                });
            }

            // Validação email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: 'Email inválido'
                });
            }

            // Validação telefone
            const phoneRegex = /^[\d\s-()]+$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: 'Telefone inválido'
                });
            }

            const volunteer = await VolunteerService.updateVolunteer(id, req.body);
            return res.status(200).json({
                message: 'Voluntário atualizado com sucesso',
                volunteer
            });
        } catch (error) {
            return res.status(404).json({
                message: 'Erro ao atualizar voluntário',
                error: error.message
            });
        }
    }

    // Excluir voluntário
    static async deleteVolunteer(req, res) {
        try {
            const { id } = req.params;
            const result = await VolunteerService.deleteVolunteer(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(404).json({
                message: 'Erro ao excluir voluntário',
                error: error.message
            });
        }
    }
}

module.exports = VolunteerController;

