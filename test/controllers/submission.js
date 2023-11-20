const Submission = require('../models/Submission');
const Test = require('../models/Test');

const {
    Op
} = require("sequelize"); // Op is a special operator for sequelize

// istanbul ignore next
const submit_test = async (req, res) => {

    const {
        test_id,
        user_id,
        score
    } = req.body

    if(!test_id || !user_id) {
        return res.status(400).json({
            message: 'Test id and user id are required'
        })
    }

   // Check if Test exists
    const test = await Test.findByPk(test_id)
    if (!test) {
        return res.status(400).json({
            message: 'Test not found'
        })
    }

    // Check if user_id in test.users
    const users = test.users
    if (!users.includes(user_id)) {
        return res.status(400).json({
            message: 'User not registered in this test'
        })
    }

    const obj = {
        test_id,
        user_id,
        score
    }

    await Submission.create(obj)

    return res.status(201).json(obj)
}

module.exports = {
    submit_test,
};