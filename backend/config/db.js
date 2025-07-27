const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../pawtastic.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database error:', err);
    else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        breed TEXT,
        birthday TEXT,
        gender TEXT,
        weight TEXT,
        fixed INTEGER DEFAULT 0,
        medical_conditions TEXT,
        medications TEXT,
        diet TEXT,
        activity_level TEXT,
        temperament TEXT,
        last_vet_visit TEXT,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        duration TEXT,
        description TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petId INTEGER NOT NULL,
        serviceId INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (petId) REFERENCES pets(id),
        FOREIGN KEY (serviceId) REFERENCES services(id)
    )`);
});

module.exports = db;