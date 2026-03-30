const jwt = require('jsonwebtoken');

// Проверка токена (авторизация)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

// Проверка роли админа
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };