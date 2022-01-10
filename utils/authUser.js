import axios from 'axios';
import baseUrl from './baseUrl';
import catchErrors from './catchErrors';
import Router from 'next/router';
import cookie from 'js-cookie';

const setToken = (token) => {
	cookie.set('token-user', token);
	Router.push('/');
};

// function untuk mengirimkan data ke database. menerima data user (user), link image, route, configForm
export const sendingUserCredentials = async (
	user,
	profilePicUrl,
	route,
	setConfigForm
) => {
	let data;
	try {
		//jika routenye signup
		if (route === 'signup') {
			//data menjadi seperti ini
			data = {
				user,
				profilePicUrl,
			};
		} else {
			// jika signin
			data = { user };
		}

		const token = await axios.post(`${baseUrl}/api/${route}`, data);
		// set token pake cookies, lalu redirect
		setToken(token);
	} catch (error) {
		// jangan lupa set errormsg ketika error
		const errorMsg = catchErrors(error);
		setConfigForm((configForm) => ({
			...configForm,
			errorMsg: errorMsg,
		}));
	}

	//ubah loading jadi false
	setConfigForm((configForm) => ({
		...configForm,
		formLoading: false,
	}));
};

export const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
