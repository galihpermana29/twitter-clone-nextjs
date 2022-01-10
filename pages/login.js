import baseUrl from '../utils/baseUrl';
import axios from 'axios';
import {
	HeaderMessage,
	FooterMessage,
} from '../components/Common/WelcomeMessage';
import {
	Form,
	Button,
	Message,
	Segment,
	TextArea,
	Divider,
} from 'semantic-ui-react';

import useHandleData from '../utils/handlingForm/signInUp';
import { useEffect } from 'react';
import { sendingUserCredentials } from '../utils/authUser';

const Login = () => {
	const { user, setuser, configForm, setConfigForm, checkIsFilled } =
		useHandleData('SIGNIN');
	const { email, password } = user;
	const {
		showSocialMedia,
		showPassword,
		formLoading,
		errorMsg,
		submitDisable,
		username,
		usernameLoading,
		usernameAvailable,
	} = configForm;

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setuser((user) => ({ ...user, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setConfigForm((configForm) => ({
			...configForm,
			formLoading: true,
		}));
		await sendingUserCredentials(user, '', 'auth', setConfigForm);
	};

	useEffect(() => {
		checkIsFilled(user);
	}, [user]);
	return (
		<>
			<HeaderMessage />
			<Form
				loading={formLoading}
				error={errorMsg !== null}
				onSubmit={handleSubmit}
			>
				<Message
					error
					header="oops"
					content={errorMsg}
					onDismiss={() =>
						setConfigForm((configForm) => ({
							...configForm,
							errorMsg: null,
						}))
					}
				/>
				<Segment>
					<Form.Input
						required
						label="Email"
						placeholder="Email"
						name="email"
						value={email}
						onChange={handleChange}
						fluid
						icon="envelope"
						iconPosition="left"
						type="email"
					/>
					<Form.Input
						label="Password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={handleChange}
						fluid
						icon={{
							name: 'eye',
							circular: true,
							link: true,
							onClick: () =>
								setConfigForm((configForm) => ({
									...configForm,
									showPassword: !showPassword,
								})),
						}}
						iconPosition="left"
						type={showPassword ? 'text' : 'password'}
						required
					/>
					<Divider hidden />
					<Button
						content="Sign In"
						color="orange"
						type="submit"
						disabled={submitDisable}
					/>
				</Segment>
			</Form>

			<FooterMessage />
		</>
	);
};

export default Login;
