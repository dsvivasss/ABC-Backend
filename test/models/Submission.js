const {
    Sequelize,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/db.js');
const env = process.env.NODE_ENV

const Submission = sequelize.define("submission", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        // Defaultvalue as UTC times
        defaultValue: DataTypes.NOW
    }
});

module.exports = Submission;