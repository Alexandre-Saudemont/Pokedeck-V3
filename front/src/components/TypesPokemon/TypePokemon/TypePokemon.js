import {useNavigate} from 'react-router-dom';
import {PokemonByTypesRequest} from '../../../requests';
import './TypePokemon.css';

function TypePokemon({id, nom}) {
	const navigate = useNavigate();
	async function handleClick(e) {
		const response = await PokemonByTypesRequest(id);
		if (response.status === 200) {
			navigate('/detailsType', {state: {data: response.data}});
		}
	}
	return (
		<div className='type-container'>
			<div className={`type-button type-button-${nom}`}>
				<img className={`type-button type-button-${nom}`} value={id} src={`/assets/${nom}.png`} alt={`${nom}`} onClick={handleClick} />
				{nom}
			</div>
		</div>
	);
}

export default TypePokemon;
