const express = require('express')
const usersRoutes = require('./routes/users.js')
const token = require('./middlewares/token.js')
const serverless = require('serverless-http')

const app = express();

app.use(express.json()) // Middleware to accept json data
app.use(token)

// Routes
app.use(usersRoutes)

process.env.NODE_ENV !== 'test' ? app.listen(3000, () => console.log("Server running on port 3000")) : null;

if (process.env.NODE_ENV === 'test') {
    module.exports = app
} else {
    module.exports.handler = serverless(app)
}

// const handler = serverless(app)
// export { handler}