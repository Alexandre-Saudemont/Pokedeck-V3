import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PokedexRequest, PokemonRequestByID, addPokemonToDeck, saveAuthorization, deletePokemon, DeckRequest} from '../../../requests/index.js';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import pokemonTypeColors from '../../../constants/PokemonTypeColors.js';
import Swal from 'sweetalert2';
import './Pokemon.css';

function Pokemon({nom, url, id, isLogged, setDeck, deck}) {
	const navigate = useNavigate();
	const UserId = localStorage.getItem('id');
	const token = sessionStorage.getItem('token');
	const [backgroundStyles, setBackgroundStyles] = useState({});
	const [nameStyles, setNameStyles] = useState({});

	// Fonction pour naviguer vers les détails du Pokémon
	async function handleClick() {
		const response = await PokemonRequestByID(id);

		if (response.status === 200) {
			navigate('/detailsPokemon', {
				state: {
					id: response.data.id,
					nom: response.data.nom,
					url: response.data.url,
					pv: response.data.pv,
					attaque: response.data.attaque,
					attaque_spe: response.data.attaque_spe,
					defense: response.data.defense,
					defense_spe: response.data.defense_spe,
					vitesse: response.data.vitesse,
				},
			});
		}
	}

	// Fonction pour ajouter un Pokémon au deck
	async function handleAdd() {
		try {
			saveAuthorization(token);
			const response = await addPokemonToDeck(UserId, id);
			if (response.status === 200 && response.data.success) {
				const res = await DeckRequest(UserId);
				if (res.status === 200) {
					setDeck(res.data);
					Swal.fire({
						icon: 'success',
						text: `${nom} a été ajouté avec succès`,
					});
				}
			} else {
				Swal.fire({
					icon: 'error',
					text: response.data.error,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	// Fonction pour supprimer un Pokémon du deck
	async function handleDelete() {
		try {
			saveAuthorization(token);
			const response = await deletePokemon(UserId, {pokemon_id: id});
			if (response.status === 200) {
				const newDeckFiltered = deck.filter((pokemon) => pokemon.id !== id);
				setDeck(newDeckFiltered);
				Swal.fire({
					icon: 'success',
					text: `${nom} supprimé avec succès`,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	// Fonction pour récupérer le deck
	async function requestForDeck() {
		if (!UserId || !token) {
			console.error('UserId ou token manquant');
			return;
		}

		try {
			saveAuthorization(token);
			const res = await DeckRequest(UserId);
			if (res.status === 200) {
				setDeck(res.data);
			}
		} catch (error) {
			console.error('Erreur lors de la requête :', error);
		}
	}

	// useEffect pour déclencher requestForDeck lorsque isLogged change
	useEffect(() => {
		if (isLogged && UserId && token) {
			requestForDeck();
		} else {
			setDeck([]); // Réinitialisez le deck si l'utilisateur est déconnecté
		}
	}, [isLogged]); // Déclenchez l'effet lorsque isLogged change

	// useEffect pour styliser le Pokémon
	useEffect(() => {
		async function fetchPokemonData() {
			const typesData = await PokedexRequest();
			const pokemonData = typesData.find((pokemon) => pokemon.id === id);
			if (pokemonData && pokemonData.types) {
				const typesColors = pokemonData.types.map((type) => pokemonTypeColors[type]);
				const gradientColors = typesColors.length > 1 ? typesColors : [typesColors[0], `${typesColors[0]}88`];
				const background = `linear-gradient(to left top, ${gradientColors.join(', ')})`;
				setBackgroundStyles({backgroundImage: background});
				const textGradient = typesColors.length > 1 ? `linear-gradient(to right, ${typesColors.join(', ')})` : typesColors[0];
				setNameStyles({
					background: textGradient,
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
				});
			}
		}
		fetchPokemonData();
	}, [id]);

	return (
		<div className='pokemon-container'>
			<img className='pokemon-img' src={url} onClick={handleClick} alt='pokemon' style={backgroundStyles} />
			<div className='pokemon-title'>
				<h1 className='pokemon-nom' style={nameStyles}>
					{nom}
				</h1>

				{isLogged && (
					<div className='pokemon-button'>
						{deck && deck.some((pokemon) => pokemon.id === id) ? (
							<button className='pokemon-icon' onClick={handleDelete}>
								<RemoveCircleOutlineIcon />
							</button>
						) : (
							<button className='pokemon-icon' onClick={handleAdd}>
								<ControlPointRoundedIcon />
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Pokemon;
