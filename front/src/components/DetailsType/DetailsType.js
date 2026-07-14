import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {PokedexRequest, addPokemonToDeck, saveAuthorization, deletePokemon, DeckRequest} from '../../requests/index.js';

import './DetailsType.css';

import {Box, Button} from '@mui/material';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from 'sweetalert2';
import pokemonTypeColors from '../../constants/PokemonTypeColors.js';

function DetailsType({isLogged, deck, setDeck}) {
	const {state} = useLocation();
	const UserId = localStorage.getItem('id');
	const token = sessionStorage.getItem('token');

	const [backgroundStyles, setBackgroundStyles] = useState({});

	async function requestForDeck() {
		try {
			saveAuthorization(token);
			const res = await DeckRequest(UserId);
			if (res.status === 200) {
				setDeck(res.data);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function handleAdd(e) {
		try {
			saveAuthorization(token);
			const pokemonId = e.target.value;

			const response = await addPokemonToDeck(UserId, pokemonId); // Utiliser l'id du pokemon ici

			if (response.status === 200 && response.data.success) {
				const res = await DeckRequest(UserId);
				if (res.status === 200) {
					setDeck(res.data);
					return Swal.fire({
						icon: 'success',
						text: `${e.target.name} a été ajouté avec succès`,
					});
				}
			}

			Swal.fire({
				icon: 'error',
				text: response.data.error,
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function handleDelete(e) {
		try {
			saveAuthorization(token);
			const response = await deletePokemon(UserId, {pokemon_id: e.target.value});
			if (response.status === 200) {
				const newDeckFiltered = deck.filter((pokemon) => pokemon.id !== e.target.value);
				setDeck(newDeckFiltered);
				return Swal.fire({
					icon: 'success',
					text: ` ${e.target.name} supprimé avec succès`,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (UserId) {
			requestForDeck();
		}
	}, [UserId]);

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

	useEffect(() => {
		async function fetchPokemonData() {
			try {
				const typesData = await PokedexRequest();
				const updatedBackgroundStyles = {};

				state.data.forEach((pokemon) => {
					const matchedPokemon = typesData.find((p) => p.id === pokemon.id);
					if (matchedPokemon) {
						const gradientStyle = getTypeGradientStyle(matchedPokemon.types);
						updatedBackgroundStyles[pokemon.id] = gradientStyle;
					}
				});
				setBackgroundStyles(updatedBackgroundStyles);
			} catch (error) {
				console.error('Failed to fetch pokemon types:', error);
			}
		}
		fetchPokemonData();
	}, [state.data]);

	return (
		<div className='detail-type'>
			{state.data.map((data) => (
				<div className='detail-type-container' key={data.id}>
					<h2 className='detail-type-name'>{data.nom}</h2>
					<div className='detail-type-image-container' style={backgroundStyles[data.id]}>
						<img src={data.url} className='detail-type-img' alt='pokemon' />
					</div>
					<div className='detail-type-stats-container'>
						<StatBar label='PV' value={data.pv} />
						<StatBar label='Attaque' value={data.attaque} />
						<StatBar label='Attaque Spé' value={data.attaque_spe} />
						<StatBar label='Défense' value={data.defense} />
						<StatBar label='Défense Spé' value={data.defense_spe} />
						<StatBar label='Vitesse' value={data.vitesse} />
					</div>
					<Box sx={{pt: '.3em', display: 'flex', justifyContent: 'center'}}>
						{isLogged &&
							(deck && deck.some((pokemon) => pokemon.id === data.id) ? (
								<Button
									className='pokemon-icon'
									onClick={(e) => {
										e.target.name = data.nom;
										e.target.value = data.id;
										handleDelete(e);
									}}>
									<RemoveCircleOutlineIcon />
								</Button>
							) : (
								<Button
									className='pokemon-icon'
									onClick={(e) => {
										e.target.name = data.nom;
										e.target.value = data.id;
										handleAdd(e);
									}}>
									<ControlPointRoundedIcon />
								</Button>
							))}
					</Box>
				</div>
			))}
		</div>
	);
}

export default DetailsType;
