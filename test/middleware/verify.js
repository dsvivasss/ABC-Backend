const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
require('dotenv').config();

async function verifyToken(req, res, next) {
    const routesToSkip = [
        '/project',
    ];

    console.log({path: req.path})

    if (routesToSkip.includes(req.path)) {
        console.log('Skipping')
        return next();
    }

    const token = req.headers.authorization.split(' ')[1]

    console.log({token})
    
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        })
    }

    const verify = await fetch('https://fbv4hhaaxb.execute-api.us-east-1.amazonaws.com/dev/auth/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            request_type: req.method
        })
    })

    const json_response = await verify.json()

    console.log({json_response})

    if (verify.status === 200) {
        return next()
    }

    return res.status(401).json({
        message: json_response.message
    })
}

module.exports = verifyToken;