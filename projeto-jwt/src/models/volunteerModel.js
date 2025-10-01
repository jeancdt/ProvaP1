const db = require('../config/database');

class VolunteerModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM volunteers');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM volunteers WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(volunteer) {
        const { name, phone, email } = volunteer;
        const [result] = await db.query(
            'INSERT INTO volunteers (name, phone, email) VALUES (?, ?, ?)',
            [name, phone, email]
        );
        return { id: result.insertId, name, phone, email };
    }

    static async update(id, volunteer) {
        const { name, phone, email } = volunteer;
        const [result] = await db.query(
            'UPDATE volunteers SET name = ?, phone = ?, email = ? WHERE id = ?',
            [name, phone, email, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM volunteers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = VolunteerModel;