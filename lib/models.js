const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.database,
    process.env.username,
    process.env.password,
    {
        host: process.env.host,
        dialect: 'mysql'
    }
);

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = { User };