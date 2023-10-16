const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const token = require('./middlewares/token')
const permissions = require('./middlewares/permissions')
const serverless = require('serverless-http')

var jwt = require('jsonwebtoken');
require('dotenv').config();

const users = require('./users.json')

const app = express()
const secret = process.env.JWT_SECRET

// app.listen(3000)
app.use(express.json())
app.use(morgan('tiny'))
app.use(helmet())
// app.use(token)
app.use(permissions)

app.get('/auth/', (_, res) => {
    res.json({
        message: 'Hello World'
    })
})

app.post('/auth/login', (req, res) => {
    const {
        username,
        password
    } = req.body

    const user = users.find(x => x.username === username && x.password === password)

    if (user) {
        const token = jwt.sign({
                sub: user.id,
                name: user.username,
                exp: Date.now() + 60 * 60 * 1000,
                permissions: user.permissions
            },
            secret
        )

        res.json({
            token
        })
        return
    }

    res.status(401).json({
        message: 'Invalid credentials'
    })

})

app.post('/auth/verify', (req, res) => {
    return res.status(200).json({
        message: 'Valid token and permissions'
    })
})

// console.log('Server on port 3000')

module.exports.handler = serverless(app)

//////////////////////////////////////////////////

// import express from "express";
// import usersRoutes from "./src/routes/users.js";
// import token from "./src/middlewares/token.js";

// const app = express();

// app.use(express.json()) // Middleware to accept json data
// app.use(token)

// // Routes
// app.use(usersRoutes)

// process.env.NODE_ENV !== 'test' ? app.listen(3000, () => console.log("Server running on port 3000")) : null;

// export default app;