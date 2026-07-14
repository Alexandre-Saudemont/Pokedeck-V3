require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const router = require('./app/router');
const app = express();
const cors = require('cors');

app.set('views', './views');
app.use(cors('*'));

app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(PORT, () => {
	console.log(`Server on at : http://localhost:${PORT}`);
});
