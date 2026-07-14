// const Deck = require('../Models/deckModel');
// const Pokemon = require('../Models/pokemonModel');
// const DeckPokemon = require('../Models/deck_pokemonModel');
const {Deck, Pokemon, DeckPokemon} = require('../Models');

const deckController = {
	getDeck: async (req, res) => {
		try {
			const id = req.params.id;
			const pokemonDeck = await Pokemon.findAll({
				include: {
					association: 'pokeDeck',
					where: {
						id: id,
					},
				},
			});

			return res.status(200).json(pokemonDeck);
		} catch (error) {
			console.error(error);
			return res.status(404).json({
				error: 'Problème survenu sur la méthode getDeck',
			});
		}
	},

	addPokemonToDeck: async (req, res) => {
		try {
			const UserId = req.params.id;

			const deck = await Deck.findOne({
				where: {
					user_id: UserId,
				},
			});

			if (!deck) {
				return res.status(404).json({
					error: "Pas de deck pour l'utilisateur demandé",
				});
			}
			const deckId = deck.dataValues.id;
			const {id, pokemon_id} = req.body;

			const pokemonIdCheck = await Pokemon.findByPk(pokemon_id);

			if (!pokemonIdCheck) {
				return res.status(404).json({
					error: `Pas de pokemon correspondant à l'id ${pokemon_id}`,
				});
			}

			const deckPokemon = await DeckPokemon.findAll({
				where: {
					deck_id: deckId,
				},
			});

			if (deckPokemon.length === 5) {
				return res.status(200).json({
					error: `Vous avez déjà 5 pokemons enregistrés dans votre deck.`,
				});
			}

			if (deckPokemon.length > 0) {
				const deckPokemonFilter = deckPokemon.filter((pokemon) => pokemon.dataValues.pokemon_id === Number(pokemon_id));

				if (deckPokemonFilter.length > 0) {
					return res.status(404).json({
						error: 'Vous avez déjà ajouté ce pokemon dans votre Deck',
					});
				}

				const newDeckPokemon = DeckPokemon.build({
					id,
					deck_id: deckId,
					pokemon_id: pokemon_id,
				});

				newDeckPokemon.save();

				return res.status(200).json({
					success: `Ajout de ${pokemonIdCheck.nom} effectuée avec succès`,
				});
			}

			const newDeckPokemon = DeckPokemon.build({
				id,
				deck_id: deckId,
				pokemon_id: pokemon_id,
			});

			newDeckPokemon.save();
			return res.status(200).json({
				success: `Ajout de ${pokemonIdCheck.nom} effectuée avec succès`,
			});
		} catch (error) {
			console.error(error);
			res.status(404).json({
				error: 'Problème avec la requête de modification de Deck',
			});
		}
	},

	deleteOnePokemonToDeck: async (req, res) => {
		try {
			/*
           Je veux aller chercher le deck correspondant à mon utilisateur dans la table Deck
           avec l'id du deck je vais aller chercher les instances existantes pour cet utiliseur           
           puis aller vérifier si l'id du pokemon que je veux supprimer est présent dans une de ces instances
           Si oui, je supprime l'instance correspondant (id, deck_id, pokemon_id)
           Sinon je ne fais rien
           */
			const UserId = req.params.id;
			const deck = await Deck.findOne({
				where: {
					user_id: UserId,
				},
			});

			if (!deck) {
				return res.status(404).json({
					error: "Pas de deck pour l'utilisateur demandé",
				});
			}
			const deckId = deck.dataValues.id;
			const {id, pokemon_id} = req.body;
			const pokemonIdCheck = await Pokemon.findByPk(pokemon_id);

			if (!pokemonIdCheck) {
				return res.status(404).json({
					error: `Pas de pokemon correspondant à l'id ${pokemon_id}`,
				});
			}
			const deckPokemon = await DeckPokemon.findAll({
				where: {
					deck_id: deckId,
				},
			});

			if (deckPokemon.length > 1) {
				deckPokemon.forEach((pokemon) => {
					if (pokemon.dataValues.pokemon_id === Number(pokemon_id)) {
						pokemon.destroy();
						return res.status(200).json({
							success: `${pokemonIdCheck.dataValues.nom} a bien été supprimé de votre deck`,
						});
					}
				});
			} else {
				deckPokemon[0].destroy();
				return res.status(200).json({
					success: `${pokemonIdCheck.dataValues.nom} a bien été supprimé de votre deck`,
				});
			}
		} catch (error) {
			console.error(error);
		}
	},

	deleteAllPokemonsToDeck: async (req, res) => {
		try {
			const UserId = req.params.id;
			const deck = await Deck.findOne({
				where: {
					user_id: UserId,
				},
			});

			if (!deck) {
				return res.status(404).json({
					error: "Pas de deck pour l'utilisateur demandé",
				});
			}
			const deckId = deck.dataValues.id;

			const deckPokemon = await DeckPokemon.findAll({
				where: {
					deck_id: deckId,
				},
			});
			if (!deckPokemon) {
				return res.status(404).json({
					error: 'Votre deck est déjà vide',
				});
			}
			deckPokemon.forEach((pokemon) => {
				pokemon.destroy();
			});

			return res.status(200).json({
				success: 'Votre deck a été réinitialisé avec succès',
			});
			/*
            Je veux aller chercher le deck correspondant à mon utilisateur comme dans la méthode getDeck
            Supprimer toutes les instances de pokemon_deck correspondant à cet utilisateur
            */
		} catch (error) {
			console.error(error);
		}
	},

	deleteDeck: async (req, res) => {
		try {
			const userId = req.params.userId;

			await Deck.destroy({where: {user_id: userId}});

			res.status(200).json({success: 'Deck supprimé avec succès'});
		} catch (error) {
			console.error(error);
			res.status(500).json({error: 'Erreur lors de la suppression du deck'});
		}
	},
};

module.exports = deckController;
