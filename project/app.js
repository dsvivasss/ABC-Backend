const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const verify = require('./middleware/verify')
const projects = require('./projects.json')
const fs = require('fs')
const serverless = require('serverless-http')

const app = express()

// app.listen(5001)
app.use(express.json())
app.use(morgan('tiny'))
app.use(helmet())
app.use(verify)

app.post('/project/', (req, res) => {

    const project_info = req.body

    const random_id = Math.floor(Math.random() * 1000)

    const new_project = {
        id: random_id,
        ...project_info
        }

    projects.push(new_project)

    fs.writeFile('./projects.json', JSON.stringify(projects), (err) => {
        if (err) {
            console.log(err)
        }
    })

    return res.json(new_project)
})

app.get('/project', (_, res) => {
    return res.json({
        message: 'Hello World deployed'
    })
})

app.get('/project', (_, res) => {
    return res.json(projects)
})

// console.log('Server running at http://localhost:5001')

module.exports.handler = serverless(app)