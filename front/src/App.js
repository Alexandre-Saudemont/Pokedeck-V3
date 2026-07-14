import {useState, useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import Pokemons from './components/Pokemons/Pokemons.js';
import DetailsPokemon from './components/DetailsPokemon/DetailsPokemon.js';
import TypesPokemon from './components/TypesPokemon/TypesPokemon.js';
import Inscription from './components/Inscription/Inscription.js';
import Connexion from './components/Connexion/Connexion.js';
import DetailsType from './components/DetailsType/DetailsType.js';
import Navbar from './components/NavBar/NavBar.js';
import Deck from './components/Deck/Deck';
import Profil from './components/Profil/Profil';
import Footer from './components/Footer/Footer';
import axios from 'axios';

import './App.css';

function App() {
	const [success, setSuccess] = useState('');
	const [deck, setDeck] = useState([]);
	const [isLogged, setIsLogged] = useState(false);
	const [pokedex, setPokedex] = useState([]);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (!isLogged) {
			setDeck([]);
		}
	}, []);

	return (
		<div className='App'>
			<Navbar
				setSuccess={setSuccess}
				isLogged={isLogged}
				setIsLogged={setIsLogged}
				setPokedex={setPokedex}
				isActive={isActive}
				setDeck={setDeck}
			/>
			<Routes>
				<Route
					path='/'
					element={
						<Pokemons
							pokedex={pokedex}
							setPokedex={setPokedex}
							isLogged={isLogged}
							setIsActive={setIsActive}
							setDeck={setDeck}
							deck={deck}
						/>
					}
				/>
				<Route path='/detailsPokemon' element={<DetailsPokemon setIsActive={setIsActive} />} />
				<Route path='/detailsType' element={<DetailsType setIsActive={setIsActive} isLogged={isLogged} deck={deck} setDeck={setDeck} />} />
				<Route path='/types' element={<TypesPokemon setIsActive={setIsActive} setDeck={setDeck} />} />
				<Route path='Inscription' element={<Inscription setIsActive={setIsActive} />} />
				<Route
					path='Connexion'
					element={
						<Connexion
							success={success}
							setSuccess={setSuccess}
							isLogged={isLogged}
							setIsLogged={setIsLogged}
							setIsActive={setIsActive}
							setDeck={setDeck}
						/>
					}
				/>
				<Route path='/Deck' element={<Deck setIsActive={setIsActive} setDeck={setDeck} deck={deck} />} />
				<Route path='/Profil' element={<Profil setIsLogged={setIsLogged} setIsActive={setIsActive} />} />
			</Routes>
			<Footer />
		</div>
	);
}

export default App;
