const {
    Sequelize,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/db.js');
const env = process.env.NODE_ENV

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
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('hard_skills')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('hard_skills', value)
                return
            }
            this.setDataValue('hard_skills', JSON.stringify(value))
        }
    },
    users: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('users')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('users', value)
                return
            }
            this.setDataValue('users', JSON.stringify(value))
        }
    },
    questions: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('questions')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('questions', value)
                return
            }
            this.setDataValue('questions', JSON.stringify(value))
        }
    }
});

module.exports = Test;