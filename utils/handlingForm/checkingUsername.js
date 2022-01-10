import { regexUserName } from '../authUser';
import axios from 'axios';
import baseUrl from '../baseUrl';
export const checkingUsername = async (username, setConfigForm, setuser) => {
	// cek apakah memenuhi persyaratan username atau usernamenya kosong
	if (regexUserName.test(username) && username !== '') {
		// set loading username jadi true, dan available nya jadi true untuk sementara
		setConfigForm((configForm) => ({
			...configForm,
			usernameAvailable: true,
			usernameLoading: true,
		}));

		try {
			// cek username ke database
			const { data } = await axios.get(`${baseUrl}/api/signup/${username}`);
			// jika avail
			if (data === 'Username available') {
				// set avail jadi true
				setConfigForm((configForm) => ({
					...configForm,
					usernameAvailable: true,
				}));
				// set data username di user
				setuser((user) => ({
					...user,
					username,
				}));
			}
		} catch (error) {
			// jika error, username already taken
			setConfigForm((configForm) => ({
				...configForm,
				errorMsg: 'Username already taken',
				usernameAvailable: false,
			}));
		}
		// hentikan loading username
		setConfigForm((configForm) => ({
			...configForm,
			usernameLoading: false,
		}));
	} else {
		//jika username field kosong return
		if (username === '') return;
		setConfigForm((configForm) => ({
			...configForm,
			errorMsg: 'Username is blank or contain prohibited symbols',
			usernameAvailable: false,
		}));
	}
};
