const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    const saltRounds = 10;

    const {
        name,
        email,
        password,
        language,
        phone,
        country,
        skills,
        personality,
    } = req.body;

    if (!name || !email || !password || !language || !phone || !country || !skills || !personality) {
        return res.status(400).json({
            message: 'Bad Request: Missing required fields'
        });
    }

    let userExists;
    try {
        // check if user already exists with email
        userExists = await User.findOne({
            where: {
                email
            }
        });

        if (userExists) {
            return res.status(412).json({
                message: 'User already exists'
            });
        }

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {

                // Store hash in database here
                const user = new User({
                    name,
                    email,
                    password: hash.toString(),
                    salt,
                    language,
                    phone,
                    country,
                    skills,
                    personality,
                });

                user.save()
                    .then(result => {
                        res.status(201).json({
                            id: result.id,
                            createdAt: result.createdAt,
                        })
                    })
            });
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error finding user',
            error: err
        });
    }

}

const login = async (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Bad Request: Missing required fields'
        });
    }

    try {

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        // expire at in 3 days only date
        // const expireAt = new Date(Date.now() + 86400 * 1000);
        const expireAt = new Date(Date.now() + 86400 * 3 * 1000).toISOString().split('T')[0];

        const token = jwt.sign({
            id: user.id,
            expireAt,
        }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours

        });

        user.token = token;
        user.expireAt = expireAt;

        await user.save();

        res.status(200).json({
            id: user.id,
            token,
            expireAt,
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error finding user',
            error: err
        });
    }
};



const retrieveUser = async (req, res) => {

    try {

        const user = await User.findOne({
            where: {
                id: req.userId
            }
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error finding user',
            error: err
        });
    }
}

const healthCheck = async (req, res) => {
    res.status(200).send('pong');
}

module.exports = {
    register,
    login,
    retrieveUser,
    healthCheck,
};