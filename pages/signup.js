import {
	HeaderMessage,
	FooterMessage,
} from '../components/Common/WelcomeMessage';
import React, { useState, useEffect, useRef } from 'react';
import { regexUserName } from '../utils/authUser';
import {
	Form,
	Button,
	Message,
	Segment,
	TextArea,
	Divider,
} from 'semantic-ui-react';

import CommonInputs from '../components/Common/CommonInputs';
import ImageDrop from '../components/Common/ImageDrop';
import useHandleData from '../utils/handlingForm/signInUp';

const Signup = () => {
	const { user, setuser, configForm, setConfigForm, checkIsFilled } =
		useHandleData('SIGNUP');
	const { name, email, password, bio } = user;

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

	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [highlighted, setHighlighted] = useState(false);
	const inputRef = useRef();

	const handleSubmit = (e) => e.preventDefault();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'media') {
			setMedia(files[0]);
			setMediaPreview(URL.createObjectURL(files[0]));
		}
		setuser((user) => ({ ...user, [name]: value }));
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
					<ImageDrop
						highlighted={highlighted}
						setHighlighted={setHighlighted}
						inputRef={inputRef}
						handleChange={handleChange}
						mediaPreview={mediaPreview}
						setMediaPreview={setMediaPreview}
						setMedia={setMedia}
					/>
					<Form.Input
						required
						label="Name"
						placeholder="Name"
						value={name}
						onChange={handleChange}
						fluid
						icon="user"
						name="name"
						iconPosition="left"
					/>
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
					<Form.Input
						loading={usernameLoading}
						error={!usernameAvailable}
						required
						label="Username"
						placeholder="Username"
						value={username}
						onChange={(e) => {
							let val = e.target.value;
							setConfigForm((configForm) => ({
								...configForm,
								username: val,
							}));
							if (regexUserName.test(e.target.value)) {
								setConfigForm((configForm) => ({
									...configForm,
									usernameAvailable: true,
								}));
							} else {
								setConfigForm((configForm) => ({
									...configForm,
									usernameAvailable: false,
								}));
							}
						}}
						fluid
						icon={usernameAvailable ? 'check' : 'close'}
						iconPosition="left"
					/>
					<CommonInputs
						user={user}
						configForm={configForm}
						setConfigForm={setConfigForm}
						handleChange={handleChange}
					/>
					<Divider hidden />
					<Button
						content="Sign Up"
						color="orange"
						type="submit"
						disabled={submitDisable || !usernameAvailable}
					/>
				</Segment>
			</Form>
			<FooterMessage />
		</>
	);
};

export default Signup;

