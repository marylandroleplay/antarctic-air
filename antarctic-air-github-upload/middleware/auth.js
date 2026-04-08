const requireAdmin = (req, res, next) => {
    // Read raw cookies since we are completely stateless for Vercel
    const cookies = req.headers.cookie || '';
    if (cookies.includes('admin_token=authenticated')) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
};

module.exports = { requireAdmin };
