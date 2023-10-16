const sequelize = require('../config/db.js');
const {
    DataTypes
} = require("sequelize");
const Sequelize = require("sequelize");

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
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
        allowNull: false
    },
    skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    personality: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
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

// User.sync({
//         force: true
//     })
//     .then(() => console.log("User table created successfully"))
//     .catch(err => console.log("Error creating User table: ", err));

module.exports = User;