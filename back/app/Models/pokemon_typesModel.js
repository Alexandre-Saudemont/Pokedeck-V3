const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class PokemonTypes extends Sequelize.Model { };

PokemonTypes.init({
    pokemon_id:Sequelize.INTEGER,
    type_id:Sequelize.INTEGER
}, {
    sequelize,
    tableName:"pokemon_type",
    timestamps:false
})

module.exports = PokemonTypes;