const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'pawtastic_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Seed initial data
    db.get("SELECT COUNT(*) as count FROM services", (err, row) => {
        if (row.count === 0) {
            const services = [
                { name: 'Vaccination', price: 40, duration: '30 min' },
                { name: 'Check-up', price: 30, duration: '45 min' },
                { name: 'Grooming', price: 25, duration: '1 hour' },
                { name: 'Dental Cleaning', price: 75, duration: '1 hour' },
                { name: 'Surgery Consult', price: 150, duration: 'Varies' }
            ];
            
            services.forEach(s => {
                db.run("INSERT INTO services (name, price, duration) VALUES (?, ?, ?)", 
                    [s.name, s.price, s.duration]);
            });
        }
    });
});