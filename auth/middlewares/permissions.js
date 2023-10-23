function permissions(req, res, next) {

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

    console.log({path: req.path})

    if (routesToSkip.includes(req.path)) {
        return next();
    }

    const permissions = req.tokenPayload.permissions;
    const request_type = req.body.request_type;

    if (request_type === 'GET') {
        if (permissions.includes('read')) return next();
    }

    if (request_type === 'POST') {
        if (permissions.includes('write')) return next();
    }

    return res.status(401).json({
        message: `You do not have permissions to ${request_type === 'GET' ? 'read' : 'write'}`
    });
}

module.exports = permissions;