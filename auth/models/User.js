const sequelize = require('../config/db.js');
const {
    DataTypes
} = require("sequelize");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV
console.log('env: ', env);

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    language: {
        // type: DataTypes.STRING,
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [
                ['es', 'en']
            ]
        }
    },
    phone: { // Telefono debe tener 10 digitos y ser numerico
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    skills: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('skills')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('skills', value)
                return
            }
            this.setDataValue('skills', JSON.stringify(value))
        }
    },
    personality: {
        type: env !== 'test' ? DataTypes.ARRAY(DataTypes.STRING) : DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('personality')
            if (env !== 'test') return rawValue
            return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
            if (env !== 'test') {
                this.setDataValue('personality', value)
                return
            }
            this.setDataValue('personality', JSON.stringify(value))
        }
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expireAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        // Defaultvalue as UTC time
        defaultValue: DataTypes.NOW
    }
});

module.exports = User;