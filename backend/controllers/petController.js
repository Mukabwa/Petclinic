const db = require('../config/db');

module.exports = {
    createPet(req, res) {
        const { name, breed, birthday, gender, weight, fixed } = req.body;
        const userId = req.session.userId;
        
        db.run(
            `INSERT INTO pets (name, breed, birthday, gender, weight, fixed, userId)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, breed, birthday, gender, weight, fixed, userId],
            function(err) {
                if (err) return res.status(400).json({ error: err.message });
                res.status(201).json({
                    id: this.lastID,
                    name, breed, birthday, gender, weight, fixed
                });
            }
        );
    },

    getPetDetails(req, res) {
        const { id } = req.params;
        db.get(
            `SELECT * FROM pets WHERE id = ? AND userId = ?`,
            [id, req.session.userId],
            (err, pet) => {
                if (err || !pet) return res.status(404).json({ error: 'Pet not found' });
                res.json(pet);
            }
        );
    },

    updatePetDetails(req, res) {
        const { id } = req.params;
        const { medical_conditions, medications, diet, activity_level, temperament, last_vet_visit } = req.body;
        
        db.run(
            `UPDATE pets SET 
                medical_conditions = ?,
                medications = ?,
                diet = ?,
                activity_level = ?,
                temperament = ?,
                last_vet_visit = ?
             WHERE id = ? AND userId = ?`,
            [medical_conditions, medications, diet, activity_level, temperament, last_vet_visit, id, req.session.userId],
            function(err) {
                if (err) return res.status(400).json({ error: err.message });
                if (this.changes === 0) return res.status(404).json({ error: 'No changes made' });
                res.json({ message: 'Pet details updated' });
            }
        );
    },

    getUserPets(req, res) {
        db.all(
            `SELECT id, name, breed, gender FROM pets WHERE userId = ?`,
            [req.session.userId],
            (err, pets) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(pets);
            }
        );
    }
};