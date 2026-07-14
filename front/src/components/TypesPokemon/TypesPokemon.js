import {useState, useEffect} from 'react';
import {TypesRequest, DeckRequest, saveAuthorization} from '../../requests';
import TypePokemon from './TypePokemon/TypePokemon.js';
import './TypesPokemon.css';

function TypesPokemon({setIsActive, setDeck}) {
	const token = sessionStorage.getItem('token');
	const UserId = localStorage.getItem('id');

	const [types, setTypes] = useState([]);

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

	async function RequestForTypes() {
		try {
			const response = await TypesRequest();
			setTypes(response.data);
			setIsActive(false);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		RequestForTypes();
		if (UserId) {
			requestForDeck();
		}
	}, []);

	return (
		<div id='types'>
			<div className='types-pokemon'>{types.length > 0 && types.map((type) => <TypePokemon key={type.id} {...type} />)}</div>
			<p className='types-copyright'>Icons by @AdeptCharon</p>
		</div>
	);
}

export default TypesPokemon;
