import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {userInfosRequest, saveAuthorization, UpdateUserRequest, UserDeleteRequest} from '../../requests';
import './Profil.css';
import {CardHeader, Card, Box, CardContent, Typography, Modal, Button, Input, InputLabel, TextField} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';

function Profil({setIsLogged, setIsActive}) {
	const token = sessionStorage.getItem('token');
	const id = localStorage.getItem('id');
	const [infosUser, setInfosUser] = useState('');
	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const {register, handleSubmit} = useForm();
	const navigate = useNavigate();

	const handleOpen = () => {
		setOpen(true);
		setError('');
		setSuccess('');
		// Initialiser les valeurs avec les données actuelles
		if (infosUser) {
			setLastname(infosUser.lastname || '');
			setFirstname(infosUser.firstname || '');
			setUsername(infosUser.username || '');
			setEmail(infosUser.email || '');
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const timeOutFunction = () => {
		navigate('/');
	};

	const succesModification = () => {
		Swal.fire({
			icon: 'success',
			text: 'Modification effectuée avec succès',
			timerProgressBar: true,
			showConfirmButton: false,
			timer: 2000,
		});
	};

	async function requestInfoUser() {
		try {
			saveAuthorization(token);
			const response = await userInfosRequest(id);

			setInfosUser(response.data);
			setEmail(response.data.email);
			setUsername(response.data.username);
			setFirstname(response.data.firstname);
			setLastname(response.data.lastname);
		} catch (error) {
			console.error(error);
		}
	}

	async function onSubmit(data) {
		try {
			saveAuthorization(token);
			const response = await UpdateUserRequest(id, data);
			if (response.status === 200 && response.data.success) {
				setInfosUser((prevState) => ({
					...prevState,
					email: data.email,
					username: data.username,
					firstname: data.firstname,
					lastname: data.lastname,
				}));
				setSuccess(response.data.success);
				setError('');
				handleClose();
			} else {
				setSuccess('');
				setError(response.data.error);
			}
		} catch (error) {
			console.error(error);
			setSuccess('');
			setError(error.response.data.error);
		}
	}

	async function handleDelete() {
		Swal.fire({
			icon: 'question',
			title: 'Êtes-vous sûr de vouloir supprimer votre compte ?',
			showCancelButton: true,
			showCloseButton: true,
			confirmButtonText: 'Oui, je suis sûr',
			cancelButtonText: 'Non, annuler',
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					saveAuthorization(token);
					const response = await UserDeleteRequest(id);

					if (response.status === 200) {
						localStorage.removeItem('id');
						sessionStorage.removeItem('token');
						setIsLogged(false);

						Swal.fire({
							icon: 'success',
							text: 'Compte supprimé avec succès',
							timer: 2000,
							timerProgressBar: true,
							showConfirmButton: false,
						}).then(() => {
							navigate('/');
						});
					}
				} catch (error) {
					Swal.fire({
						icon: 'error',
						text: error.response?.data?.error || 'Une erreur est survenue',
					});
				}
			}
		});
	}

	useEffect(() => {
		requestInfoUser();
		setIsActive(false);
	}, []);

	useEffect(() => {
		if (success && !error) {
			succesModification();
		}
	}, [success, error]);

	return (
		<div id='profil'>
			{infosUser && (
				<>
					<Box>
						<Card className='profil-card'>
							<CardHeader
								avatar={<AccountCircleIcon sx={{fontSize: '3rem', color: '#4A90E2'}} />}
								title={
									<Typography variant='h4' className='profil-title'>
										Mon Profil
									</Typography>
								}
								subheader={
									<Typography variant='body2' className='profil-subtitle'>
										Gérez vos informations personnelles
									</Typography>
								}
								sx={{
									paddingBottom: '1.5rem',
									borderBottom: `1px solid var(--border-color)`,
									marginBottom: '1.5rem',
								}}
							/>
							<CardContent className='profil-content'>
								<div className='profil-info-item'>
									<div className='profil-info-icon'>
										<PersonIcon />
									</div>
									<div className='profil-info-content'>
										<Typography className='profil-info-label'>Nom</Typography>
										<Typography className='profil-info-value'>{infosUser.lastname}</Typography>
									</div>
								</div>

								<div className='profil-info-item'>
									<div className='profil-info-icon'>
										<PersonIcon />
									</div>
									<div className='profil-info-content'>
										<Typography className='profil-info-label'>Prénom</Typography>
										<Typography className='profil-info-value'>{infosUser.firstname}</Typography>
									</div>
								</div>

								<div className='profil-info-item'>
									<div className='profil-info-icon'>
										<AccountCircleIcon />
									</div>
									<div className='profil-info-content'>
										<Typography className='profil-info-label'>Pseudo</Typography>
										<Typography className='profil-info-value'>{infosUser.username}</Typography>
									</div>
								</div>

								<div className='profil-info-item'>
									<div className='profil-info-icon'>
										<EmailIcon />
									</div>
									<div className='profil-info-content'>
										<Typography className='profil-info-label'>Email</Typography>
										<Typography className='profil-info-value'>{infosUser.email}</Typography>
									</div>
								</div>
							</CardContent>

							<div className='profil-actions'>
								<Button className='profil-submit profil-submit-edit' onClick={handleOpen} startIcon={<EditIcon />}>
									Modifier mes informations
								</Button>
								<Button className='profil-submit profil-submit-delete' onClick={handleDelete} startIcon={<DeleteForeverIcon />}>
									Supprimer mon compte
								</Button>
							</div>
						</Card>
					</Box>

					<Modal keepMounted={true} open={open} onClose={handleClose} className='profil-modal'>
						<Box className='profil-modal-container'>
							<div className='profil-modal-header'>
								<Typography variant='h5' className='profil-modal-title'>
									Modifier mes informations
								</Typography>
								<Button className='profil-modal-close' onClick={handleClose}>
									<CloseIcon />
								</Button>
							</div>
							<form className='profil-form' onSubmit={handleSubmit(onSubmit)}>
								<div className='profil-form-field'>
									<InputLabel className='profil-form-label'>Nom</InputLabel>
									<TextField
										{...register('lastname')}
										value={lastname}
										onChange={(e) => setLastname(e.target.value)}
										required
										fullWidth
										variant='outlined'
										className='profil-form-input-field'
										placeholder={infosUser.lastname}
									/>
								</div>

								<div className='profil-form-field'>
									<InputLabel className='profil-form-label'>Prénom</InputLabel>
									<TextField
										{...register('firstname')}
										value={firstname}
										onChange={(e) => setFirstname(e.target.value)}
										required
										fullWidth
										variant='outlined'
										className='profil-form-input-field'
										placeholder={infosUser.firstname}
									/>
								</div>

								<div className='profil-form-field'>
									<InputLabel className='profil-form-label'>Pseudo</InputLabel>
									<TextField
										{...register('username')}
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
										fullWidth
										variant='outlined'
										className='profil-form-input-field'
										placeholder={infosUser.username}
									/>
								</div>

								<div className='profil-form-field'>
									<InputLabel className='profil-form-label'>Email</InputLabel>
									<TextField
										{...register('email')}
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										fullWidth
										variant='outlined'
										className='profil-form-input-field'
										placeholder={infosUser.email}
									/>
								</div>

								{error && (
									<Typography className='profil-form-error' color='error'>
										{error}
									</Typography>
								)}

								<div className='profil-form-actions'>
									<Button className='profil-form-cancel' onClick={handleClose}>
										Annuler
									</Button>
									<Button className='profil-form-edit-submit' type='submit'>
										Enregistrer
									</Button>
								</div>
							</form>
						</Box>
					</Modal>
				</>
			)}
		</div>
	);
}

export default Profil;
