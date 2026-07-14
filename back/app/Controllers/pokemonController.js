const {Pokemon, Types} = require('../Models');

const pokemonController = {
	getAllPokemon: async (req, res) => {
		try {
			const allPokemon = await Pokemon.findAll();
			return res.status(200).json(allPokemon);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Un problème est survenu sur la route getAllPokemon'});
		}
	},

	getPokemonByTypes: async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			if (!id) {
				return res.status(403).json({error: 'Aucun pokemon correspondant. Veuillez réessayer avec un autre pokemon.'});
			}
			const PokemonByType = await Pokemon.findAll({
				include: [
					{
						association: 'types',
						where: {
							id: id,
						},
					},
				],
			});
			return res.status(200).json(PokemonByType);
		} catch (error) {
			console.error(error);
			return res.status(500).json({error: 'Un problème est survenu sur la route getPokemonByTypes'});
		}
	},

	getPokedexData: async (req, res) => {
		try {
			const pokedexData = require('../data/pokedex.json');
			const typesData = pokedexData.map((pokemon) => ({
				id: pokemon.numero,
				nom: pokemon.nom,
				types: pokemon.type,
			}));

			return res.status(200).json(typesData);
		} catch (error) {
			console.error('Failed to load pokedex data', error);
			return res.status(500).json({error: 'Failed to load pokedex data'});
		}
	},

	getPokemonById: async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			if (!id) {
				return res.status(403).json({error: 'Aucun pokemon correspondant. Veuillez réessayer avec un autre pokemon.'});
			}
			const pokemonById = await Pokemon.findByPk(id, {
				include: [
					{
						model: Types,
						as: 'types',
					},
				],
			});
			if (!pokemonById) {
				return res.status(404).json({error: 'Pokemon non trouvé'});
			}
			return res.status(200).json(pokemonById);
		} catch (error) {
			console.error('Erreur lors de la récupération du Pokémon:', error);
			return res.status(500).json({error: 'Un problème est survenu sur la route getPokemonById'});
		}
	},
};

module.exports = pokemonController;
