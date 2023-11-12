const Test = require('../models/Test');

const {
    Op
} = require("sequelize"); // Op is a special operator for sequelize

const create = async (req, res) => {

    const {
        title,
        type,
        project_id,
        company_id,
        difficulty_level,
        hard_skills,
        users,
        questions
    } = req.body

    if (!title || !type || !project_id || !company_id) {
        return res.status(400)
            .json({
                message: 'Fields title, type, project_id and company_id are required'
            })
    }

    const obj = {
        title,
        type,
        project_id,
        company_id,
        difficulty_level,
        hard_skills,
        users,
        questions
    }

    await Test.create(obj)

    return res.status(201).json(obj)

}

const retrieveTests = async (req, res) => {
    const {
        project_id
    } = req.params
    
    const tests = await Test.findAll({
        where: {
            project_id
        }
    })

    return res.status(200).json(tests)
}

const healthCheck = async (req, res) => {
    res.status(200).send('pong');
}

module.exports = {
    create,
    retrieveTests,
    healthCheck,
};