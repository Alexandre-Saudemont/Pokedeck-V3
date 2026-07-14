import {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {PokemonRequest} from '../../requests';
import {AppBar, Toolbar, Input, Button} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PokedexLogo from '../../asset/PokedeckLogo.png';

import './NavBar.css';

function Navbar({isLogged, setIsLogged, setPokedex, setSuccess, isActive}) {
	const navigate = useNavigate();
	const token = sessionStorage.getItem('token');
	const [value, setValue] = useState('');
	const [menuBurger, setMenuBurger] = useState(false);
	const [searchVisible, setSearchVisible] = useState(false);

	function handleBurger() {
		setMenuBurger(!menuBurger);
	}

	async function handleLogout() {
		const userId = localStorage.getItem('id');

		if (!userId) {
			console.error('UserId manquant');
			return;
		}
		sessionStorage.removeItem('token');
		localStorage.removeItem('id');
		localStorage.removeItem('deck');
		setIsLogged(false);
		setSuccess('');
		navigate('/');
	}

	function onClickLogin() {
		if (isLogged) {
			navigate('/Profil');
		} else {
			navigate('/Connexion');
		}
	}

	function handleSearchClick() {
		setSearchVisible(!searchVisible);
	}

	useEffect(() => {
		if (token) {
			setIsLogged(true);
		}
	}, []);

	function handleChange(event) {
		setValue(event.target.value);
		requestForFilteredPokemon(event.target.value);
	}

	async function requestForFilteredPokemon(pokemonSearched) {
		try {
			const response = await PokemonRequest();
			const searchPokemonFiltered = response.data.filter((pokemon) => {
				const pokemonToLowerCase = pokemon.nom.toLowerCase();
				return pokemonToLowerCase.includes(pokemonSearched.toLowerCase());
			});

			setPokedex(searchPokemonFiltered);
		} catch (error) {
			console.error(error);
		}
	}
	const theme = createTheme({
		typography: {
			fontFamily: `"Inter", "Alumni Sans Collegiate One", sans-serif`,
		},
	});
	return (
		<nav id='navbar'>
			<AppBar sx={{bgcolor: 'transparent', boxShadow: 'none', width: '100vw', marginLeft: 'calc(50% - 50vw)'}}>
				<Toolbar id='navbar-toolbar'>
					<div id='navbar-container-menu'>
						<NavLink to='/'>
							<img src={PokedexLogo} alt='Pokedex Logo' className='nav-pokedeck-icon' />
						</NavLink>

						{/* <Button> */}
						<NavLink className='nav-menu' to='/types'>
							Types
						</NavLink>
						{/* </Button> */}
						{isLogged ? (
							<>
								{/* <Button> */}
								<NavLink className='nav-menu' to='/Deck'>
									Deck
								</NavLink>
								<NavLink className='nav-menu' onClick={handleLogout}>
									Déconnexion
								</NavLink>
							</>
						) : (
							<></>
						)}
					</div>
					<div className='nav-pokedex'>
						<Button onClick={handleBurger} id='nav-burger'>
							<MenuIcon className='nav-burger-icon' />
						</Button>

						{isActive && (
							<Button id='nav-search-responsive'>
								<SearchIcon className='nav-burger-icon' sx={{width: '2rem'}} onClick={handleSearchClick} />
							</Button>
						)}
					</div>
					{menuBurger && (
						<div id='navbar-container-menu-burger'>
							{isLogged ? (
								<>
									<Button onClick={handleBurger}>
										<NavLink className='nav-menu' to='/'>
											Accueil
										</NavLink>
									</Button>
									<Button onClick={handleBurger}>
										<NavLink className='nav-menu' to='/Deck'>
											Deck
										</NavLink>
										<NavLink className='nav-menu' to='/types'>
											Types
										</NavLink>
									</Button>
									<Button onClick={handleBurger}>
										<NavLink className='nav-menu' to='/Profil'>
											Profil
										</NavLink>
									</Button>
									<Button
										sx={{
											':hover': {bgcolor: 'rgba(74, 144, 226, 0.1)', fontFamily: 'Inter, sans-serif'},
										}}
										className='nav-menu-disconnect-button'
										type='button'
										onClick={handleLogout}>
										Déconnexion
									</Button>
								</>
							) : (
								<div className='navbar-containter-notLogged'>
									<Button sx={{':hover': {bgcolor: 'rgba(74, 144, 226, 0.1)'}}} onClick={handleBurger}>
										<NavLink className='nav-menu ' to='/'>
											Accueil
										</NavLink>
									</Button>
									<Button onClick={handleBurger} sx={{':hover': {bgcolor: 'rgba(74, 144, 226, 0.1)'}}}>
										<NavLink className='nav-menu' to='/types'>
											Types{' '}
										</NavLink>
									</Button>

									<Button sx={{':hover': {bgcolor: 'rgba(74, 144, 226, 0.1)'}}} onClick={handleBurger}>
										<NavLink className='nav-menu ' to='/Connexion'>
											Connexion
										</NavLink>
									</Button>
								</div>
							)}
						</div>
					)}
					<button className='nav-buttonLogin' onClick={onClickLogin}>
						<img className='nav-loginIcon' src='/assets/login-icon.svg' alt='login-Icon' />
					</button>
					{isActive ? (
						<>
							<div className={`nav-element-right ${searchVisible ? 'nav-search-visible' : ''}`}>
								<input
									className='nav-search'
									id='search'
									type='search'
									value={value}
									onChange={handleChange}
									placeholder='Rechercher...'
								/>
							</div>
						</>
					) : (
						<div className='nav-element-right-empty'></div>
					)}
				</Toolbar>
			</AppBar>
		</nav>
	);
}

export default Navbar;
