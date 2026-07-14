const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class DeckPokemon extends Sequelize.Model { };

DeckPokemon.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    deck_id:  {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    pokemon_id: {
        type: Sequelize.INTEGER,
        allowNull:true
    }
    
},
    {
    sequelize,
    tableName: "deck_pokemon",
    timestamps: false
    }
)


module.exports = DeckPokemon;