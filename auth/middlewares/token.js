const jwt = require('jsonwebtoken');

function token(req, res, next) {
    const routesToSkip = [
        '/users/',
        '/users/auth/',
        '/users/ping/',
        '/users',
        '/users/auth',
        '/users/ping',
        '/companies/',
        '/companies/auth/',
        '/companies/ping/',
        '/companies',
        '/companies/auth',
        '/companies/ping',
    ];

    if (routesToSkip.includes(req.path)) {
        return next();
    }

    const authorization = req.header('Authorization')

    if (!authorization) {
        return res.status(400).json({
            message: 'No authorization header'
        });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(400).json({
            message: 'No token, authorization denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // date without time and timezone
        const date = new Date().toISOString().split('T')[0];
        const today = new Date(date);

        if (new Date(decoded.expireAt) < today) {
            return res.status(401).json({
                message: 'Token expired'
            });
        }

        req.userId = decoded.id;
        next();

    } catch (err) {
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
}

module.exports = token;