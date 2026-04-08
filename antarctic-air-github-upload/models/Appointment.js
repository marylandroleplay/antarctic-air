const { getDb, saveDb, generateId } = require('./db.js');

class Appointment {
    constructor(data) {
        Object.assign(this, data);
        this.createdAt = new Date();
        this._id = generateId();
        this.resolved = false;
    }
    async save() {
        const db = getDb();
        db.appointments.push(this);
        saveDb(db);
        return this;
    }
    static find() {
        const db = getDb();
        return { sort: () => Promise.resolve(db.appointments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))) };
    }
    static async findByIdAndDelete(id) {
        const db = getDb();
        db.appointments = db.appointments.filter(a => a._id !== id);
        saveDb(db);
    }
    static async findByIdAndUpdate(id, update) {
        const db = getDb();
        const appt = db.appointments.find(a => a._id === id);
        if (appt) {
            Object.assign(appt, update);
            saveDb(db);
        }
        return appt;
    }
}
module.exports = Appointment;
