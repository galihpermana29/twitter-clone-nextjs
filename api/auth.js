const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');


router.post('/', async (req, res) => {
	const { email, password } = req.body.user;

	//cek apakah email valid
	if (!isEmail(email)) return res.status(401).send('Email is invalid');

	//cek apakah password kurang dari 6
	if (password.length < 6)
		return res.status(401).send('Password must be atleast 6 characters');

	try {
		//cek apakah email ada di database?
		const user = await UserModel.findOne({
			email: email.toLowerCase(),
		}).select('+password');
		if (!user) return res.status(401).send('Wrong email!');

		// cek password di database?
		const isPassword = await bcrypt.compare(password, user.password);
		if (!isPassword) return res.status(401).send('Wrong password!');

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
