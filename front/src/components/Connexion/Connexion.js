import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {LoginRequest, DeckRequest, saveAuthorization} from '../../requests';
import {TextField, Button, Typography} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Swal from 'sweetalert2';
import './Connexion.css';

function Connexion({setIsLogged, setIsActive, setDeck}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	// const styleBox = {
	// 	bgcolor: 'lightgrey',
	// 	p: '2rem',
	// 	textAlign: 'center',
	// };
	const timeOutFunction = () => {
		navigate('/');
	};

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			const response = await LoginRequest(email, password);
			if (response.status === 200) {
				localStorage.setItem('id', response.data.id);
				setIsLogged(true);
				Swal.fire({
					icon: 'success',
					text: `Bienvenue ${response.data.username},  Redirection en cours ...`,
					timer: 2000,
					showConfirmButton: false,
					timerProgressBar: true,
				});
				setTimeout(timeOutFunction, 2000);
				sessionStorage.setItem('token', response.data.token);
			}
			saveAuthorization(response.data.token);
			const res = await DeckRequest(response.data.id);
			if (res.status === 200) {
				setDeck(res.data);
			}
		} catch (error) {
			console.error('erreur:', error);
			Swal.fire({
				icon: 'error',
				text: `${error.response.data.error}`,
			});
			setEmail('');
			setPassword('');
		}
	}
	useEffect(() => {
		setIsActive(false);
	}, []);

	return (
		<div className='connexion-container'>
			<div className='connexion-subcontainer'>
				<div className='connexion-header'>
					<div className='connexion-header-icon'>
						<LoginIcon />
					</div>
					<Typography variant='h4' className='connexion-title'>
						Se connecter
					</Typography>
					<Typography variant='body2' className='connexion-subtitle'>
						Accédez à votre compte Pokedeck
					</Typography>
				</div>
				<form className='connexion-form' action='submit' onSubmit={handleSubmit}>
					<div className='connexion-form-field'>
						<div className='connexion-input-icon'>
							<EmailIcon />
						</div>
						<TextField
							className='connexion-input-field'
							type='email'
							name='email'
							label='Adresse Email'
							value={email}
							placeholder='Sacha@gmail.com'
							onChange={(e) => setEmail(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<div className='connexion-form-field'>
						<div className='connexion-input-icon'>
							<LockIcon />
						</div>
						<TextField
							className='connexion-input-field'
							type='password'
							name='password'
							label='Mot de passe'
							value={password}
							placeholder='********'
							onChange={(e) => setPassword(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<div className='connexion-button-container'>
						<Button id='connexion-submit' type='submit' startIcon={<LoginIcon />} fullWidth>
							Se connecter
						</Button>
						<Button href='/Inscription' id='connexion-submit-inscription' startIcon={<PersonAddIcon />} fullWidth>
							S'inscrire
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Connexion;
