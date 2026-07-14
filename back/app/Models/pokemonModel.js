const Sequelize = require('sequelize');
const sequelize = require('../config/database');

class Pokemon extends Sequelize.Model { };

Pokemon.init({
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nom: Sequelize.STRING,
    pv: Sequelize.INTEGER,
    attaque: Sequelize.INTEGER,
    defense: Sequelize.INTEGER,
    "attaque_spe": Sequelize.INTEGER,
    "defense_spe": Sequelize.INTEGER,
    vitesse: Sequelize.INTEGER,
    "url":Sequelize.STRING
}, {
    sequelize,
    tableName: "pokemon",
    timestamps: false
})

module.exports = Pokemon;