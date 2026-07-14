require('dotenv').config();
const {User, Deck, DeckPokemon} = require('../Models');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');

const usersController = {
	getAllUser: async (req, res) => {
		try {
			const allUsers = await User.findAll();
			return res.status(200).json(allUsers);
		} catch (error) {
			console.error(error);
			return res.status(404).json({error: 'Un problème est survenu sur la route getAllUser'});
		}
	},

	getUserById: async (req, res) => {
		try {
			const id = req.params.id;
			const userById = await User.findByPk(id);
			console.log(userById);
			return res.status(200).json({
				id: userById.dataValues.id,
				username: userById.dataValues.username,
				firstname: userById.dataValues.firstname,
				lastname: userById.dataValues.lastname,
				email: userById.dataValues.email,
			});
		} catch (error) {
			console.error(error);
			return res.status(404).json({error: 'Un problème est survenu sur la route getUserById'});
		}
	},

	createUser: async (req, res, next) => {
		try {
			const {id, username, firstname, lastname, password, email} = req.body;

			const userCheckEmail = await User.findOne({
				where: {
					email: email.toLowerCase(),
				},
			});

			const userCheckUsername = await User.findOne({
				where: {
					username: username.toLowerCase(),
				},
			});

			if (!email) {
				return res.status(200).json({
					error: 'Veuillez renseigner un email.',
				});
			}

			if (!username) {
				return res.status(200).json({
					error: 'Veuillez renseigner un pseudo.',
				});
			}

			if (!password) {
				return res.status(200).json({
					error: 'Veuillez renseigner un mot de passe.',
				});
			}

			if (!firstname) {
				return res.status(200).json({
					error: 'Veuillez renseigner un prénom.',
				});
			}

			if (!lastname) {
				return res.status(200).json({
					error: 'Veuillez renseigner un nom de famille.',
				});
			}

			if (userCheckUsername) {
				return res.status(200).json({
					error: 'Pseudo existant, veuillez changer de pseudo.',
				});
			}

			if (userCheckEmail) {
				return res.status(200).json({
					error: "Email existant, veuillez changer d'email.",
				});
			}

			if (!emailValidator.validate(email)) {
				return res.status(200).json({
					error: 'Email non-valide, veuillez rentrer un email valide.',
				});
			}

			if (password.length < 8) {
				return res.status(200).json({
					error: ' Votre mot de passe doit faire 8 caractères minimum.',
				});
			}

			const hashedPassword = bcrypt.hashSync(password, 10);

			const user = User.build({
				id,
				username: username.toLowerCase(),
				firstname: firstname.toLowerCase(),
				lastname: lastname.toLowerCase(),
				email: email.toLowerCase(),
				password: hashedPassword,
			});

			await user.save();

			const deck = Deck.build({
				id,
				user_id: user.dataValues.id,
				userId: user.dataValues.userId,
			});

			await deck.save();

			// const deckPokemon = DeckPokemon.build({
			//     id,
			//     deck_id: deck.dataValues.id
			// })

			// deckPokemon.save();
			return res.status(201).json({
				success: 'Utilisateur créé avec succès.',
			});
		} catch (error) {
			console.error(error);
		}
	},

	// connectUser: async (req, res) => {
	// 	try {
	// 		const getUser = await User.findOne({
	// 			where: {
	// 				email: req.body.email.toLowerCase(),
	// 			},
	// 		});

	// 		if (!getUser) {
	// 			return res.status(400).json({
	// 				error: 'Aucun utilisateur trouvé avec ces identifiants',
	// 			});
	// 		}
	// 		if (getUser) {
	// 			const passwordCheck = await bcrypt.compare(req.body.password, getUser.password);
	// 			console.log('passwordCheck', passwordCheck);
	// 			if (!passwordCheck) {
	// 				return res.status(400).json({
	// 					error: 'Mot de passe incorrect',
	// 				});
	// 			}

	// 			const token = jwt.sign(
	// 				{
	// 					userId: getUser.id,
	// 					userEmail: getUser.email,
	// 				},
	// 				process.env.accessTokenSecret,
	// 				{
	// 					expiresIn: '24h',
	// 				},
	// 			);

	// 			console.log('token', token);

	// 			return res.status(200).json({
	// 				success: 'Vous êtes connecté',
	// 				id: getUser.id,
	// 				email: getUser.email,
	// 				username: getUser.username,
	// 				firstname: getUser.firstname,
	// 				lastname: getUser.lastname,
	// 				token,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 		res.status(500).json({
	// 			error: 'ereur lors de la requête',
	// 		});
	// 	}
	// },
	connectUser: async (req, res) => {
		try {
			const {email, password} = req.body;

			// Vérifiez si email et password sont présents
			if (!email || !password) {
				return res.status(400).json({
					error: 'Les identifiants sont requis',
				});
			}

			// Recherchez l'utilisateur dans la base de données
			const getUser = await User.findOne({
				where: {
					email: email.toLowerCase(),
				},
			});

			// Vérifiez si l'utilisateur existe
			if (!getUser) {
				return res.status(400).json({
					error: 'Identifiants incorrects',
				});
			}

			// Vérifiez le mot de passe
			const passwordCheck = await bcrypt.compare(password, getUser.password);

			if (!passwordCheck) {
				return res.status(400).json({
					error: 'Identifiants incorrects',
				});
			}

			// Générez le token JWT
			const token = jwt.sign(
				{
					userId: getUser.id,
					userEmail: getUser.email,
				},
				process.env.accessTokenSecret,
				{
					expiresIn: '24h',
				},
			);

			// Renvoyez la réponse avec le token et les informations utilisateur
			return res.status(200).json({
				success: 'Vous êtes connecté',
				id: getUser.id,
				email: getUser.email,
				username: getUser.username,
				firstname: getUser.firstname,
				lastname: getUser.lastname,
				token,
			});
		} catch (error) {
			console.error(error);
			// En cas d'erreur, renvoyez une réponse générique
			res.status(500).json({
				error: 'Erreur lors de la requête',
			});
		}
	},

	updateUser: async (req, res) => {
		try {
			const id = req.params.id;
			const user = await User.findByPk(id);

			const {username, firstname, lastname, email} = req.body;
			console.log(email);

			const userCheckEmail = await User.findOne({
				where: {
					email: email.toLowerCase(),
				},
			});

			const userCheckUsername = await User.findOne({
				where: {
					username: username.toLowerCase(),
				},
			});

			if (userCheckUsername && userCheckUsername.dataValues.username !== user.username) {
				console.log('je check username');
				return res.status(200).json({
					error: 'Pseudo existant, veuillez changer de pseudo.',
				});
			}

			if (userCheckEmail && userCheckEmail.dataValues.email !== user.email) {
				console.log(user.email);
				console.log(userCheckEmail.dataValues.email);
				return res.status(200).json({
					error: "Email existant, veuillez changer d'email.",
				});
			}
			user.lastname = lastname;
			user.firstname = firstname;
			user.username = username;
			user.email = email;

			await user.save();
			res.status(200).json({
				success: `Modification de l'utilisateur ${user.username} effectuée avec succès`,
			});
		} catch (error) {
			console.error(error);
			res.status(404).json({
				error: `L'utilisateur n'existe pas`,
			});
		}
	},
	deleteUser: async (req, res) => {
		const id = req.params.id;

		const user = await User.findByPk(id);

		if (user) {
			await user.destroy();
			return res.status(200).json({
				success: `Utilisateur avec le pseudo ${user.dataValues.username} supprimé avec succès`,
			});
		}
		res.status(404).json({
			error: "Erreur lors de la suppression de l'utilisateur",
		});
	},
};

module.exports = usersController;
