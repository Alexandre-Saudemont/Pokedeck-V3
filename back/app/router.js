const express = require('express');
const router = express.Router();
const pokemonController = require('./Controllers/pokemonController');
const typesController = require('./Controllers/typesController');
const usersController = require('./Controllers/usersController');
const deckController = require('./Controllers/deckController');
const jwtVerify = require('./Middleware/Middleware');

router.get('/', (_, res) => {
	res.send('We are in homepage');
});
// GET
router.get('/Pokemon', pokemonController.getAllPokemon);
router.get(`/Pokemon/:id`, pokemonController.getPokemonById);
router.get('/Types', typesController.getAllTypes);
router.get(`/Types/:id`, pokemonController.getPokemonByTypes);
router.get('/Users', usersController.getAllUser);
router.get('/User/:id', jwtVerify, usersController.getUserById);
router.get('/Deck/:id', jwtVerify, deckController.getDeck);
router.get('/Pokedex', pokemonController.getPokedexData);
// POST
router.post(`/Inscription`, usersController.createUser);
router.post('/Connexion', usersController.connectUser);
router.post('/Deck/:id', jwtVerify, deckController.addPokemonToDeck);

//PUT
router.put('/User/:id', jwtVerify, usersController.updateUser);

//DELETE
router.delete('/User/:id', jwtVerify, usersController.deleteUser);
router.delete('/Deck/Pokemon/:id', jwtVerify, deckController.deleteOnePokemonToDeck);
router.delete('/Deck/AllPokemons/:id', jwtVerify, deckController.deleteAllPokemonsToDeck);

module.exports = router;
