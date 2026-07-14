import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {RegisterRequest} from '../../requests';
import {TextField, Button, Typography} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Swal from 'sweetalert2';
import './Inscription.css';

function Inscription({setIsActive}) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const navigate = useNavigate();

	const styleBox = {
		p: '2rem',
		textAlign: 'center',
	};

	const timeOutFunction = () => {
		navigate('/Connexion');
	};

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			const response = await RegisterRequest({email, password, username, lastname, firstname});

			if (response.status === 200) {
				Swal.fire({
					icon: 'error',
					text: `${response.data.error}`,
				});
			}

			if (response.status === 201) {
				setTimeout(timeOutFunction, 3000);
				Swal.fire({
					text: `Bravo ${username} a bien été créé avec succès`,
					icon: 'success',
					timer: 3000,
					timerProgressBar: true,
					showConfirmButton: false,
					customClass: {
						timerProgressBar: '.inscription-swal-timer',
					},
				});
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				text: `${error.response.data.error}`,
			});
		}
	}
	useEffect(() => {
		setIsActive(false);
	}, []);
	useEffect(() => {
		setIsActive(false);
	}, [setIsActive]);

	return (
		<div className='inscription-container'>
			<div className='inscription-box'>
				<div className='inscription-header'>
					<div className='inscription-header-icon'>
						<PersonAddIcon />
					</div>
					<Typography variant='h4' className='inscription-title'>
						Formulaire d'inscription
					</Typography>
					<Typography variant='body2' className='inscription-subtitle'>
						Créez votre compte Pokedeck
					</Typography>
				</div>
				<form className='inscription-form' action='submit' onSubmit={handleSubmit}>
					<div className='inscription-form-field'>
						<div className='inscription-input-icon'>
							<PersonIcon />
						</div>
						<TextField
							className='inscription-input-field'
							id='lastname'
							type='text'
							name='lastname'
							label='Nom'
							value={lastname}
							placeholder='Dubois'
							onChange={(e) => setLastname(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<div className='inscription-form-field'>
						<div className='inscription-input-icon'>
							<PersonIcon />
						</div>
						<TextField
							className='inscription-input-field'
							id='firstname'
							type='text'
							name='firstname'
							label='Prénom'
							value={firstname}
							placeholder='Jean-Eude'
							onChange={(e) => setFirstname(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<div className='inscription-form-field'>
						<div className='inscription-input-icon'>
							<AccountCircleIcon />
						</div>
						<TextField
							className='inscription-input-field'
							id='username'
							type='text'
							name='username'
							label='Pseudo'
							value={username}
							placeholder='SachaLeDresseur'
							onChange={(e) => setUsername(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<div className='inscription-form-field'>
						<div className='inscription-input-icon'>
							<EmailIcon />
						</div>
						<TextField
							className='inscription-input-field'
							id='email'
							type='email'
							name='email'
							label='Adresse Email'
							value={email}
							placeholder='Pikachu@gmail.com'
							onChange={(e) => setEmail(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<div className='inscription-form-field'>
						<div className='inscription-input-icon'>
							<LockIcon />
						</div>
						<TextField
							className='inscription-input-field'
							id='password'
							type='password'
							name='password'
							label='Mot de passe'
							value={password}
							aria-describedby='password-text'
							placeholder='*********'
							onChange={(e) => setPassword(e.target.value)}
							required
							fullWidth
							variant='outlined'
						/>
					</div>
					<Button id='inscription-submit' type='submit' startIcon={<PersonAddIcon />} fullWidth>
						S'inscrire
					</Button>
				</form>
			</div>
		</div>
	);
}

export default Inscription;
