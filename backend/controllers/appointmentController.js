const db = require('../config/db');

module.exports = {
    createAppointment(req, res) {
        const { petId, serviceId, date, time, notes } = req.body;
        
        db.run(
            `INSERT INTO appointments (petId, serviceId, date, time, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [petId, serviceId, date, time, notes],
            function(err) {
                if (err) return res.status(400).json({ error: err.message });
                res.status(201).json({
                    id: this.lastID,
                    petId, serviceId, date, time, status: 'pending'
                });
            }
        );
    },

    getUserAppointments(req, res) {
        db.all(
            `SELECT a.id, a.date, a.time, a.status, p.name as petName, s.name as serviceName
             FROM appointments a
             JOIN pets p ON a.petId = p.id
             JOIN services s ON a.serviceId = s.id
             WHERE p.userId = ?`,
            [req.session.userId],
            (err, appointments) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(appointments);
            }
        );
    },

    getAvailableSlots(req, res) {
        const { date } = req.query;
        // This is simplified - in a real app you'd check against existing appointments
        const slots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
        res.json({ date, availableSlots: slots });
    }
};