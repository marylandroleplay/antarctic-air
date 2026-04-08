const { getDb, saveDb, generateId } = require('./db.js');

class Contact {
    constructor(data) {
        Object.assign(this, data);
        this.createdAt = new Date();
        this._id = generateId();
        this.resolved = false;
    }
    async save() {
        const db = getDb();
        db.contacts.push(this);
        saveDb(db);
        return this;
    }
    static find() {
        const db = getDb();
        return { sort: () => Promise.resolve(db.contacts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))) };
    }
    static async findByIdAndDelete(id) {
        const db = getDb();
        db.contacts = db.contacts.filter(c => c._id !== id);
        saveDb(db);
    }
    static async findByIdAndUpdate(id, update) {
        const db = getDb();
        const contact = db.contacts.find(c => c._id === id);
        if (contact) {
            Object.assign(contact, update);
            saveDb(db);
        }
        return contact;
    }
}
module.exports = Contact;
