const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel');
const FollowerModel = require('../models/FollowerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const userPng =
	'https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png';
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get('/:username', async (req, res) => {
	const { username } = req.params;

	try {
		//cek jika panjang nya dibawah 1 dan tidak mengikuti ketentuan regex return 401 invalid
		if (username.length < 1 || !regexUserName.test(username))
			return res.status(401).send('Invalid username');

		//cek jika user sudah ada di database, return 401 already taken
		const user = await UserModel.findOne({
			username: username.toLowerCase(),
		});
		// console.log(username, !user);
		if (user) return res.status(401).send('Username already taken');

		//jika uniq
		return res.status(200).send('Username available');
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server Error with', err);
	}
});

router.post('/', async (req, res) => {
	const {
		name,
		email,
		username,
		password,
		bio,
		facebook,
		youtube,
		twitter,
		instagram,
	} = req.body.user;

	//cek apakah email valid
	if (!isEmail(email)) return res.status(401).send('Email is invalid');

	//cek apakah password kurang dari 6
	if (password.length < 6)
		return res.status(401).send('Password must be atleast 6 characters');

	try {
		//
		if (username.length < 1 || !regexUserName.test(username))
			return res.status(401).send('Invalid username');

		//cek apakah email sudah digunakan
		const user = await UserModel.findOne({
			email: email.toLowerCase(),
		});
		if (user) return res.status(401).send('Email already taken');

		// encrypt password
		let pas;
		pas = await bcrypt.hash(password, 10);

		// siapkan model data user yang mau di store ke database
		const userData = new UserModel({
			name,
			email: email.toLowerCase(),
			username: username.toLowerCase(),
			password: pas,
			profilePicUrl: req.body.profilePicUrl || userPng,
		});

		// simpan
		await userData.save();

		// siapkan model data profile yang mau di store ke database
		const profileData = new ProfileModel({
			user: userData._id,
			bio,
			social: {
				youtube,
				instagram,
				facebook,
				twitter,
			},
		});

		// simpan
		await profileData.save();

		// siapkan model follower
		const followerData = new FollowerModel({
			user: userData._id,
			followers: [],
			following: [],
		});

		// simpan
		await followerData.save();

		// bikin jwt
		const payload = { userId: userData._id };
		jwt.sign(
			payload,
			process.env.jwtSecret,
			{ expiresIn: '2d' },
			(err, token) => {
				if (err) throw err;
				res.status(200).json(token);
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server Error with', err);
	}
});

module.exports = router;
