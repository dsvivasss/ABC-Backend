const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    Op
} = require("sequelize");

const register = async (req, res) => {

    const saltRounds = 10;

    const {
        name,
        email,
        password,
        size,
        location,
        website,
        sector,
    } = req.body;

    if (!name || !email || !password || !size || !location || !website || !sector) {
        return res.status(400).json({
            message: 'Bad Request: Missing required fields'
        });
    }

    try {

        // check if user already exists with username or email
        const companyExists = await Company.findOne({
            where: {
                [Op.or]: [{
                    name
                }, {
                    email
                }]
            }
        });

        if (companyExists) {
            return res.status(412).json({
                message: 'Company already exists'
            });
        }

        bcrypt.genSalt(saltRounds, function (_, salt) {
            bcrypt.hash(password, salt, function (_, hash) {

                // Store hash in database here
                const company = new Company({
                    name,
                    email,
                    password: hash.toString(),
                    salt,
                    size,
                    location,
                    website,
                    sector,
                });

                company.save()
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
            message: 'Error finding company',
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

        const company = await Company.findOne({
            where: {
                email
            }
        });

        if (!company) {
            return res.status(404).json({
                message: 'Company not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        // expire at in 3 days only date
        const expireAt = new Date(Date.now() + 86400 * 3 * 1000).toISOString().split('T')[0];

        const token = jwt.sign({
            id: company.id,
            expireAt,
        }, process.env.JWT_SECRET, {
            expiresIn: 86400, // 24 hours

        });

        company.token = token;
        company.expireAt = expireAt;

        await company.save();

        res.status(200).json({
            id: company.id,
            token,
            expireAt,
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error finding company',
            error: 'ERRor ' + err
        });
    }
};



const retrieveCompany = async (req, res) => {

    const company = await Company.findOne({
        where: {
            id: req.userId
        }
    });

    if (!company) {
        return res.status(404).json({
            message: 'Company not found'
        });
    }

    res.status(200).json({
        id: company.id,
        username: company.username,
        email: company.email
    });
}

const healthCheck = async (req, res) => {
    res.status(200).send('pong');
}

module.exports = {
    register,
    login,
    retrieveCompany,
    healthCheck,
};