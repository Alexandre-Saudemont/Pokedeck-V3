import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

import './DetailsPokemon.css';
import Typography from '@mui/material/Typography';

function DetailsPokemon({setIsActive}) {
	const {state} = useLocation();

	useEffect(() => {
		setIsActive(false);
	}, []);

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

	return (
		<>
			<div id='detail'>
				<div className='detail-container'>
					<Typography variant='h3' className='detail-name'>
						{state.nom}
					</Typography>
					<div id='detail-pokemon-comp'>
						<div className='detail-pokemon-img-container'>
							<img src={state.url} alt={state.nom} className='detail-pokemon-img' />
						</div>
						<div id='detail-pokemon-list-stats'>
							<StatBar label='PV' value={state.pv} />
							<StatBar label='Attaque' value={state.attaque} />
							<StatBar label='Attaque Spé' value={state.attaque_spe} />
							<StatBar label='Défense' value={state.defense} />
							<StatBar label='Défense Spé' value={state.defense_spe} />
							<StatBar label='Vitesse' value={state.vitesse} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default DetailsPokemon;
