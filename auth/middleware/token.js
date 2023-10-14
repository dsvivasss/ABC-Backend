const jwt = require('jsonwebtoken');

function token(req, res, next) {
    const routesToSkip = [
        '/login',
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
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (Date.now() > payload.exp) {
            return res.status(401).json({
                message: 'Token expired'
            });
        }

        req.tokenPayload = payload;
        next();

    } catch (err) {
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
}

module.exports = token;