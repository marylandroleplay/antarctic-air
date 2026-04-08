// Middleware to protect admin routes
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
};

module.exports = { requireAdmin };
