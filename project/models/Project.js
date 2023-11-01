const sequelize = require('../config/db.js');
const {
    DataTypes
} = require("sequelize");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV

const Project = sequelize.define("project", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 25]
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    soft_skills: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('soft_skills')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('soft_skills', value)
                return
            }
            this.setDataValue('soft_skills', JSON.stringify(value))
        }
    },
    hard_skills: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: false,
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
    roles: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('roles')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('roles', value)
                return
            }
            this.setDataValue('roles', JSON.stringify(value))
        }
    },
    users_selected: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('users_selected')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : null
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('users_selected', value)
                return
            }
            this.setDataValue('users_selected', JSON.stringify(value))
        }
    },
    users_assigned: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('users_assigned')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : null
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('users_assigned', value)
                return
            }
            this.setDataValue('users_assigned', JSON.stringify(value))
        }
    }
});

module.exports = Project;