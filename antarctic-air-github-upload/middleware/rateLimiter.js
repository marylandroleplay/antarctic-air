const rateLimit = require('express-rate-limit');

// Rate limiter for form submissions
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 form submissions per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Rate limiter for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

module.exports = {
    formLimiter,
    loginLimiter
};
