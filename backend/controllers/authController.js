const db = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = {
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            db.run(
                `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                [name, email, hashedPassword],
                function(err) {
                    if (err) return res.status(400).json({ error: err.message });
                    req.session.userId = this.lastID;
                    res.status(201).json({ 
                        id: this.lastID, 
                        name, 
                        email,
                        role: 'user'
                    });
                }
            );
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
                if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
                
                const valid = await bcrypt.compare(password, user.password);
                if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
                
                req.session.userId = user.id;
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    logout(req, res) {
        req.session.destroy(err => {
            if (err) return res.status(500).json({ error: 'Logout failed' });
            res.clearCookie('connect.sid');
            res.json({ message: 'Logged out successfully' });
        });
    },

    getCurrentUser(req, res) {
        if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
        
        db.get(
            `SELECT id, name, email, role FROM users WHERE id = ?`,
            [req.session.userId],
            (err, user) => {
                if (err || !user) return res.status(404).json({ error: 'User not found' });
                res.json(user);
            }
        );
    }
};