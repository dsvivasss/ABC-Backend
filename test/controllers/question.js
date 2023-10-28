const Question = require('../models/Question');
const Option = require('../models/Option');
const questions = require('../data/questions.json');

const { Op } = require("sequelize"); // Op is a special operator for sequelize

const populate = async (req, res) => {

    // Delete all questions and options
    await Question.destroy({
        where: {},
    })

    questions.forEach(async (question) => {
        const question_creation = await Question.create({
            difficulty_level: question.difficulty_level,
            topic: question.topic,
            description: question.description,
            type_question: question.type_question,
        })

        question.options.forEach(async (option) => {
            await Option.create({
                description: option.value,
                correct_answer: option.correct,
                questionId: question_creation.id
            })
        })
    })

    // Return Options collapsed as a single array
     
    const all_questions = await Question.findAll({
        include: {
            model: Option
        }
    })

    return res.status(200)
        .json(all_questions)

}

const selectQuestion = async (req, res) => {

    const default_options = {
        return_answers: false
    }

    const { topics, difficulty_level, question_type, options = default_options } = req.body

    if (!topics || !difficulty_level || !question_type) {
        return res.status(400)
            .json({ message: 'Missing parameters' })
    }

    const questions = await Question.findAll({
        where: {
            topic: {
                [Op.in]: topics
            },
            difficulty_level: difficulty_level,
            type_question: question_type
        },
        include: options?.return_answers ? {
            model: Option
        } : null
    })

    return res.status(200).json(questions)

}

const healthCheck = async (req, res) => {
    res.status(200).send('pong');
}

module.exports = {
    populate,
    selectQuestion,
    healthCheck,
};