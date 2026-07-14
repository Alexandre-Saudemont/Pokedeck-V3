const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class User extends Sequelize.Model { };

User.init({

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false
    }

}, {
    sequelize,
    tableName: "user",
    timestamps: false
})


module.exports = User;