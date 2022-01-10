import { useEffect, useState } from 'react';

const useHandleData = (data) => {
	const [user, setuser] = useState({
		name: '',
		email: '',
		password: '',
		bio: '',
		facebook: '',
		youtube: '',
		twitter: '',
		instagram: '',
		username: '',
	});

	const [configForm, setConfigForm] = useState({
		showSocialMedia: false,
		showPassword: false,
		formLoading: false,
		errorMsg: null,
		submitDisable: true,
		username: '',
		usernameLoading: false,
		usernameAvailable: false,
	});

	const checkIsFilled = (user) => {
		const isUser = Object.values({ ...user }).every((item) => Boolean(item));
		isUser
			? setConfigForm((configForm) => ({
					...configForm,
					submitDisable: false,
			  }))
			: setConfigForm((configForm) => ({
					...configForm,
					submitDisable: true,
			  }));
	};
	if (data === 'SIGNIN') {
		delete user['name'];
		delete user['bio'];
		delete user['username'];
		delete user['facebook'];
		delete user['twitter'];
		delete user['instagram'];
		delete user['youtube'];
	}
	return { user, setuser, configForm, setConfigForm, checkIsFilled };
};

export default useHandleData;
