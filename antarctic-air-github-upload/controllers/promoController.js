const Promo = require('../models/Promo');

exports.getPromo = async (req, res) => {
    try {
        let promo = await Promo.findOne();
        if (!promo) {
            promo = new Promo({ text: 'New customers get 10% off service calls this month — mention this ad when you call!' });
            await promo.save();
        }
        res.json({ text: promo.text, isActive: promo.isActive });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updatePromo = async (req, res) => {
    try {
        const { text, isActive } = req.body;
        let promo = await Promo.findOne();
        if (promo) {
            promo.text = text !== undefined ? text : promo.text;
            promo.isActive = isActive !== undefined ? isActive : promo.isActive;
            promo.updatedAt = Date.now();
            await promo.save();
        } else {
            promo = new Promo({ text, isActive });
            await promo.save();
        }
        res.json(promo);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
