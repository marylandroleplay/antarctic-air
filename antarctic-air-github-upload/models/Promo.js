const { getDb, saveDb } = require('./db.js');

class Promo {
    constructor(data) {
        Object.assign(this, data);
        this.updatedAt = new Date();
    }
    async save() {
        const db = getDb();
        db.promo = this;
        saveDb(db);
        return this;
    }
    static async findOne() {
        const db = getDb();
        if (!db.promo) return null;
        const promo = new Promo(db.promo);
        return promo;
    }
}
module.exports = Promo;
