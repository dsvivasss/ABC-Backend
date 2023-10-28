const express = require('express')
const questionRoutes = require('./routes/questions.js')
const testRoutes = require('./routes/tests.js')
// const token = require('./middlewares/token.js')
const serverless = require('serverless-http')
const cors = require('cors')

const app = express();

app.use(express.json()) // Middleware to accept json data
app.use(cors())
// app.use(token)

// Routes
app.use(questionRoutes)
app.use(testRoutes)

// process.env.NODE_ENV === 'local' ? app.listen(3000, () => console.log("Server running on port 3000")) : null;

if (process.env.NODE_ENV === 'test') {
    module.exports = app
} else {
    module.exports.handler = serverless(app)
}

// const handler = serverless(app)
// export { handler}