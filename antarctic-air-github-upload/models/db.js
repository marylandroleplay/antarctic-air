const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, '../data.json');

if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ contacts: [], appointments: [], promo: null }));
}

function getDb() {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function saveDb(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = { getDb, saveDb, generateId };
