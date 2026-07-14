import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}`,
});

export async function PokedexRequest() {
	const response = await axiosInstance.get('/Pokedex');

	return response.data.map((pokemon) => ({
		id: pokemon.id,
		nom: pokemon.nom,
		types: pokemon.types,
	}));
}
axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token'); // Récupération du token

	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

export function PokemonRequest() {
	const response = axiosInstance.get('/Pokemon');
	return response;
}

export function PokemonRequestByID(id) {
	const response = axiosInstance.get(`/Pokemon/${id}`);
	return response;
}

export function TypesRequest() {
	const response = axiosInstance.get('/Types');
	return response;
}

export function PokemonByTypesRequest(id) {
	const response = axiosInstance.get(`/Types/${id}`);
	return response;
}

export function RegisterRequest({username, firstname, password, email, lastname}) {
	return axiosInstance.post('/Inscription', {
		lastname,
		firstname,
		username,
		email,
		password,
	});
}
export async function LoginRequest(email, password) {
	try {
		const response = axiosInstance.post('/Connexion', {
			email: email,
			password: password,
		});

		if (response.status === 200) {
			sessionStorage.setItem('token', response.data.token);
			localStorage.setItem('id', response.data.id);
		}
		return response;
	} catch (error) {
		console.error('Erreur lors de la connexion:', error);
		return error;
	}
}

export function userInfosRequest(id) {
	const response = axiosInstance.get(`/User/${id}`);
	return response;
}

export function UpdateUserRequest(id, data) {
	const response = axiosInstance.put(`/User/${id}`, {
		username: data.username,
		lastname: data.lastname,
		firstname: data.firstname,
		email: data.email,
	});
	return response;
}

export function DeckRequest(id) {
	const response = axiosInstance.get(`/Deck/${id}`);
	return response;
}
export function saveAuthorization(token) {
	axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function UserDeleteRequest(id) {
	const response = axiosInstance.delete(`/User/${id}`);
	return response;
}

export async function addPokemonToDeck(UserId, pokemon_id) {
	try {
		const response = await axiosInstance.post(`/Deck/${UserId}`, {pokemon_id});

		return response;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function deletePokemon(id, pokemon_id) {
	const response = axiosInstance.delete(`/Deck/Pokemon/${id}`, {data: pokemon_id});
	return response;
}

export function deleteAllPokemons(id) {
	const response = axiosInstance.delete(`/Deck/AllPokemons/${id}`);
	return response;
}

export default axiosInstance;
