import './Footer.css';
import {Typography} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

function Footer() {
	return (
		<div id='footer'>
			<div className='footer-container'>
				<div className='footer-section footer-social'>
					<Typography className='footer-section-title'>Réseaux sociaux</Typography>
					<div className='footer-icon--container'>
						<a href='https://as-webdev.com/' target='_blank' rel='noreferrer' aria-label='Portfolio' className='footer-icon-link'>
							<LanguageIcon className='footer-icon' />
						</a>
						<a
							href='https://www.linkedin.com/in/alexandre-saudemont-535481239/'
							target='_blank'
							rel='noreferrer'
							aria-label='LinkedIn'
							className='footer-icon-link'>
							<LinkedInIcon className='footer-icon' />
						</a>
						<a
							href='https://github.com/Alexandre-Saudemont'
							target='_blank'
							rel='noreferrer'
							aria-label='GitHub'
							className='footer-icon-link'>
							<GitHubIcon className='footer-icon' />
						</a>
					</div>
				</div>
				<div className='footer-section footer-dev'>
					<Typography className='footer-section-title'>Design & développement par</Typography>
					<Typography className='footer-dev-text'>
						<a href='https://as-webdev.com/' target='_blank' rel='noreferrer' className='footer-portfolio-link'>
							<strong>AS-WebDev</strong>
						</a>
					</Typography>
				</div>
				<div className='footer-section footer-legal'>
					<Typography className='footer-copyright'>
						© 2025 <strong>AS-WebDev</strong>. Tous droits réservés.
					</Typography>
					<Typography className='footer-nintendo'>
						Pokémon et tous les noms associés sont des marques déposées de Nintendo, Creatures Inc. et Game Freak Inc.
					</Typography>
				</div>
			</div>
		</div>
	);
}

export default Footer;
