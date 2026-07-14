const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class Types extends Sequelize.Model { };

Types.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    }, 
    nom: Sequelize.STRING,
},
    {
    sequelize,
    tableName: "types",
    timestamps: false
    }
)


module.exports = Types;