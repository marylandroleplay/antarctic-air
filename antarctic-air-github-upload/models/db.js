const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, '../data.json');

let inMemoryDb = null;

function getDb() {
    if (inMemoryDb) return inMemoryDb;
    try {
        if (!fs.existsSync(dbFile)) {
            fs.writeFileSync(dbFile, JSON.stringify({ contacts: [], appointments: [], promo: null }));
        }
        return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    } catch(e) {
        inMemoryDb = { contacts: [], appointments: [], promo: null };
        return inMemoryDb;
    }
}

function saveDb(data) {
    inMemoryDb = data; // Always keep a local copy
    try {
        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    } catch(e) {
        // Ignore read-only filesystem errors on Vercel deployed environments
    }
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = { getDb, saveDb, generateId };
