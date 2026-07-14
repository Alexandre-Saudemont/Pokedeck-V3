require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	dialect: 'mysql',
	define: {timestamps: false},
});

sequelize
	.authenticate()
	.then(() => {
		console.log('connexion sequelize réussie :)');
	})
	.catch((error) => {
		console.error(error);
	});
module.exports = sequelize;
