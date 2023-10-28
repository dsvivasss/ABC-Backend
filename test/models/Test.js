const {
    Sequelize,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/db.js');

const Test = sequelize.define("test", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            len: [1, 25]
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    difficulty_level: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hard_skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    users: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
    },
    questions: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
    },
});

module.exports = Test;