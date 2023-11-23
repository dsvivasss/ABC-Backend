const Test = require('../models/Test');
const Question = require('../models/Question');
const Option = require('../models/Option');
const Submission = require('../models/Submission');
const fetch = require('node-fetch');

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

    const request = await fetch(`${process.env.URL}/projects/${project_id}/selectedcandidates`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

    const response = await request.json();

    // istanbul ignore next
    for (const test of tests) {
        const submissions = await Submission.findAll({
            where: {
                test_id: test.id
            }
        });

        const questions = await Question.findAll({
            where: {
                id: {
                    [Op.in]: test.questions
                }
            },
            include: {
                model: Option
            }
        });
    
        const questionsJSON = questions.map(question => question.toJSON());
    
        test.questions = questionsJSON;
    }

    // istanbul ignore next
    tests.map(test => (
        test.users = response.users
    ))

    // istanbul ignore next
    const testsJSON = [...tests.map(test => test.toJSON())];

    // istanbul ignore next
    for (const test of testsJSON) {
        const submissions = await Submission.findAll({
            where: {
                test_id: test.id
            }
        });

        test.submissions = submissions;
    }

    return res.status(200).json(testsJSON)
}

const healthCheck = async (req, res) => {
    res.status(200).send('pong');
}

module.exports = {
    create,
    retrieveTests,
    healthCheck,
};