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
        project_id,
        score
    } = req.body

    if(!test_id || !user_id || !project_id || !score) {
        return res.status(400).json({
            message: 'Missing required fields'
        })
    }
    
    // Check if user has already submitted a test for this project
    const existing_submission = await Submission.findOne({
        where: {
            [Op.and]: [{
                user_id: user_id
            }, {
                test_id: test_id
            }]
        }
    })

    if (existing_submission) {
        return res.status(409).json({
            message: 'User has already submitted this test'
        })
    }

    const obj = {
        test_id,
        user_id,
        project_id,
        score
    }

    await Submission.create(obj)

    return res.status(201).json(obj)
}

module.exports = {
    submit_test,
};