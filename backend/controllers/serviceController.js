// backend/controllers/serviceController.js
const db = require('../config/db');

module.exports = {
    getAllServices: (req, res) => {
        db.all('SELECT * FROM services', (err, services) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(services);
        });
    },
    
    getServiceById: (req, res) => {
        const { id } = req.params;
        db.get('SELECT * FROM services WHERE id = ?', [id], (err, service) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!service) return res.status(404).json({ error: 'Service not found' });
            res.json(service);
        });
    }
};