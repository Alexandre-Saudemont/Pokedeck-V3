const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class Deck extends Sequelize.Model { };

Deck.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id:  {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    pokemon_id: Sequelize.INTEGER,
    
},
    {
    sequelize,
    tableName: "deck",
    timestamps: false
    }
)


module.exports = Deck;