exports.login = (req, res) => {
    const { username, password } = req.body;

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'secretpassword';

    if (username === adminUser && password === adminPass) {
        const isProd = process.env.NODE_ENV === 'production';
        const secureAttr = isProd ? 'Secure;' : '';
        res.setHeader('Set-Cookie', `admin_token=authenticated; HttpOnly; ${secureAttr} Path=/; Max-Age=86400`);
        return res.json({ message: 'Login successful' });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.logout = (req, res) => {
    res.setHeader('Set-Cookie', `admin_token=; HttpOnly; Path=/; Max-Age=0`);
    res.json({ message: 'Logged out successfully' });
};

exports.checkAuth = (req, res) => {
    const cookies = req.headers.cookie || '';
    if (cookies.includes('admin_token=authenticated')) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
};
