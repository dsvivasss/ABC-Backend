const sequelize = require('../config/db.js');
const {
    DataTypes
} = require("sequelize");
const Sequelize = require("sequelize");

const Company = sequelize.define("company", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    size: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: false,
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

module.exports = Company;