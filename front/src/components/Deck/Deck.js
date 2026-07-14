import {PokedexRequest, DeckRequest, saveAuthorization, deleteAllPokemons, deletePokemon} from '../../requests';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import './Deck.css';
import Button from '@mui/material/Button';
import {Box} from '@mui/material';
import Swal from 'sweetalert2';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import pokemonTypeColors from '../../constants/PokemonTypeColors.js';

function Deck({setIsActive, setDeck, deck, id}) {
	const token = sessionStorage.getItem('token');
	const userId = localStorage.getItem('id');
	const [pokemonData, setPokemonData] = useState([]);
	const [backgroundStyles, setBackgroundStyles] = useState({});
	const styledelete = {
		fontWeight: '700',
		marginTop: '1rem',
		marginBottom: '1rem',
		background: 'white',
		'&:hover': {
			backgroundColor: 'yellow',
		},
	};

	// Fonction pour calculer le pourcentage (max 255 pour les stats Pokémon)
	const getStatPercentage = (value) => {
		return Math.min((value / 255) * 100, 100);
	};

	// Couleurs fixes pour chaque type de stat
	const getStatColor = (label) => {
		const statColors = {
			PV: '#F44336', // Rouge
			Attaque: '#4CAF50', // Vert
			'Attaque Spé': '#2196F3', // Bleu
			Défense: '#FF9800', // Orange
			'Défense Spé': '#9C27B0', // Violet
			Vitesse: '#FFEB3B', // Jaune vif
		};
		return statColors[label] || '#757575'; // Gris par défaut
	};

	// Composant de barre de stat
	const StatBar = ({label, value}) => {
		const percentage = getStatPercentage(value);
		const color = getStatColor(label);

		return (
			<div className='stat-bar-container'>
				<div className='stat-bar-label'>
					<span className='stat-label-text'>{label}</span>
					<span className='stat-value-text'>{value}</span>
				</div>
				<div className='stat-bar-wrapper'>
					<div
						className='stat-bar-fill'
						style={{
							width: `${percentage}%`,
							backgroundColor: color,
						}}></div>
				</div>
			</div>
		);
	};

	const getTypeGradientStyle = (types) => {
		const typesColors = types.map((type) => pokemonTypeColors[type]);
		const gradientColors = typesColors.length > 1 ? typesColors : [typesColors[0], `${typesColors[0]}88`];
		return {
			background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
		};
	};

	async function RequestForDeck() {
		const userId = localStorage.getItem('id');
		const token = sessionStorage.getItem('token');

		if (!userId || !token) {
			console.error('Utilisateur non connecté ou token manquant');
			return;
		}

		try {
			saveAuthorization(token);
			const response = await DeckRequest(userId);

			if (response.status === 200) {
				setDeck(response.data);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function handleDeleteDeck() {
		Swal.fire({
			icon: 'question',
			title: 'Êtes vous sur de vouloir réinitialiser votre deck ?',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonText: 'Oui, je suis sur',
			cancelButtonText: 'Non, annuler',
		})
			.then(async (result) => {
				if (result.isConfirmed) {
					const response = await deleteAllPokemons(userId);
					if (response.status === 200) {
						Swal.fire({title: 'deck supprimé avec succès !', icon: 'success'});
						setDeck([]);
						localStorage.setItem('deck', null);
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	async function handleDeletePokemon(e) {
		Swal.fire({
			icon: 'question',
			title: `Êtes vous sur de vouloir supprimer ${e.target.name} de votre deck ?`,
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonText: 'Oui, je suis sur',
			cancelButtonText: 'Non, annuler',
		})
			.then(async (result) => {
				if (result.isConfirmed) {
					saveAuthorization(token);
					const response = await deletePokemon(userId, {pokemon_id: e.target.value});

					if (response.status === 200) {
						const newDeckFiltered = deck.filter((pokemon) => pokemon.id !== Number(e.target.value));
						setDeck(newDeckFiltered);
						localStorage.setItem('deck', JSON.stringify(newDeckFiltered));
						Swal.fire({
							text: `${e.target.name} supprimé avec succès`,
							icon: 'success',
						});
					} else {
						Swal.fire({
							text: `${e.target.name} n'a pas pu être supprimé`,
							icon: 'error',
						});
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	useEffect(() => {
		const userId = localStorage.getItem('id');
		const token = sessionStorage.getItem('token');

		if (userId && token) {
			RequestForDeck();
		} else {
			setDeck([]); // Réinitialisez le deck si l'utilisateur est déconnecté
		}
	}, [userId, token]); // Déclenchez l'effet lorsque l'ID utilisateur ou le token change

	useEffect(() => {
		async function fetchPokemonData() {
			try {
				const typesData = await PokedexRequest();
				setPokemonData(typesData);
			} catch (error) {
				console.error('Failed to fetch pokemon types:', error);
			}
		}

		const userId = localStorage.getItem('id');
		const token = sessionStorage.getItem('token');

		if (userId && token) {
			fetchPokemonData();
			RequestForDeck();
		} else {
			setDeck([]); // Réinitialisez le deck si l'utilisateur est déconnecté
		}

		setIsActive(false);
	}, [deck.length, userId, token]); // Déclenchez l'effet lorsque l'ID utilisateur, le token ou la longueur du deck change

	useEffect(() => {
		async function updateBackgroundStyles() {
			if (deck.length === 0 || pokemonData.length === 0) {
				return;
			}

			const updatedBackgroundStyles = {};
			deck.forEach((pokemon) => {
				const matchedPokemon = pokemonData.find((p) => p.id === pokemon.id);
				if (matchedPokemon) {
					const gradientStyle = getTypeGradientStyle(matchedPokemon.types);
					updatedBackgroundStyles[pokemon.id] = gradientStyle;
				}
			});
			setBackgroundStyles(updatedBackgroundStyles);
		}

		updateBackgroundStyles();
	}, [deck, pokemonData]);

	return (
		<div id='deck'>
			<h1 className='deck-title'>Votre deck de Pokemons</h1>
			{deck.length === 0 ? (
				<p id='deck-nodeck-text'>
					Vous n'avez pas encore de deck. Vous pouvez ajouter des Pokemons à votre deck sur la{' '}
					<Link to='/' id='deck-nodeck-link'>
						Page d'Accueil
					</Link>
				</p>
			) : (
				<div className='deck-button'>
					<Button className='deck-reset-button' sx={styledelete} justify='center' onClick={handleDeleteDeck}>
						Réinitaliser mon deck
					</Button>
				</div>
			)}

			<div className='deck-container'>
				{deck &&
					deck.map((pokemon) => {
						return (
							<div key={pokemon.id} className='deck-pokemon'>
								<h2 className='deck-pokemon-nom'>{pokemon.nom}</h2>
								<div className='deck-image-container' style={backgroundStyles[pokemon.id]}>
									<img className='deck-pokemon-img' src={pokemon.url} alt={pokemon.nom} />
								</div>
								<div className='deck-stats-container'>
									<StatBar label='PV' value={pokemon.pv} />
									<StatBar label='Attaque' value={pokemon.attaque} />
									<StatBar label='Attaque Spé' value={pokemon.attaque_spe} />
									<StatBar label='Défense' value={pokemon.defense} />
									<StatBar label='Défense Spé' value={pokemon.defense_spe} />
									<StatBar label='Vitesse' value={pokemon.vitesse} />
								</div>
								<Box sx={{pt: '0.1em', display: 'flex', justifyContent: 'center'}}>
									<Button
										className='deck-pokemon-icon'
										onClick={(e) => {
											e.target.name = pokemon.nom;
											e.target.value = pokemon.id;
											handleDeletePokemon(e);
										}}>
										<RemoveCircleOutlineIcon />
									</Button>
								</Box>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default Deck;
