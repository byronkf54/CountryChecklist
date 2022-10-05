const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.database,
    process.env.user,
    process.env.password,
    {
        host: process.env.hostname,
        dialect: 'mysql'
    }
);

const User = sequelize.define('users', {
    userID: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,        
        autoIncrement: true
    },
    user: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
});

const visited_status = sequelize.define('visited_status', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER(50),
        allowNull: false
    },
    countryAbr: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    countryName: {
        type: DataTypes.STRING(50),
        allowNull: false 
    },
    visited: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    },
}, 
{ 
    freezeTableName: true 
})

async function createTables() {
    await User.sync();
    await visited_status.sync();
}

createTables();

module.exports = { User, visited_status };