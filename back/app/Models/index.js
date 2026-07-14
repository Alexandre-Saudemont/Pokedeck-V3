const Pokemon = require('./pokemonModel.js')
const Types = require('./typesModel.js')
const PokemonTypes = require('./pokemon_typesModel')
const Deck= require('./deckModel.js')
const User = require('./userModel.js')
const DeckPokemon = require('./deck_pokemonModel');


Pokemon.belongsToMany(Types,{
    as:"types",
    through:"pokemon_type",
    foreignKey:"pokemon_id",
    otherKey:"type_id"

})

Types.belongsToMany(Pokemon,{
    as:"pokemon",
    through:"pokemon_type",
    foreignKey:"type_id",
    otherKey:"pokemon_id"
})


PokemonTypes.belongsToMany(Pokemon,{
    as:"pokemonType",
    through:"pokemon_type",
    foreignKey:"type_id",
    otherKey:"pokemon_id"
})
PokemonTypes.belongsToMany(Types,{
    as:"typePokemon",
    through:"pokemon_type",
    foreignKey:"pokemon_id",
    otherKey:"type_id"
})

DeckPokemon.belongsToMany(Deck,{
    as:"deckPokemon",
    through:"deck_pokemon",
    foreignKey:"pokemon_id",
    otherKey:"deck_id"
})

DeckPokemon.belongsToMany(Pokemon,{
    as:"pokemonDeck",
    through:"deck_pokemon",
    foreignKey:"deck_id",
    otherkey:"pokemon_id"
})

Pokemon.belongsToMany(Deck,{
   as: "pokeDeck",
   through: "deck_pokemon",
   foreignKey: "pokemon_id",
   otherkey: "deck_id"
})

Deck.belongsToMany(Pokemon,{    
    as: "deckPokemon",
    through: "deck_pokemon",
    foreignKey: "deck_id",
    otherkey: "pokemon_id"
    })

module.exports = { User, Pokemon, Types, PokemonTypes, Deck, DeckPokemon};
