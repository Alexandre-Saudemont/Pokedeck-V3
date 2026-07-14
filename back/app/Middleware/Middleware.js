const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtVerify = (req, res, next) => {
	try {
		const authorization = req.headers.authorization;

		if (!authorization) {
			return res.status(401).json({
				error: `Pas d'en-tête Authorization`,
			});
		}

		const token = authorization.split(' ')[1];

		if (!token) {
			return res.status(401).json({
				error: 'Pas de token dans la requête',
			});
		}

		// jwt.verify(token, process.env.accessTokenSecret);
		const user = jwt.verify(token, process.env.accessTokenSecret);

		// Vérifier l'ID utilisateur extrait avec celui des paramètres de la requête
		if (req.params.id && user.userId !== Number(req.params.id)) {
			return res.status(403).json({
				error: 'Accès interdit : ID utilisateur non valide',
			});
		}
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({error: 'Token expiré'});
		}
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({error: 'Token invalide'});
		}
		return res.status(401).json({error: "Erreur d'authentification"});
	}
};

module.exports = jwtVerify;
