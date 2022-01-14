const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const FollowerModel = require('../models/FollowerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
	// console.log(req, 'request incomings');
	//req yang masuk sama kaya req di middleware bedanya, dia udah punya key userId yang di isi di middleware yang merupakan id user hasil verif jwt
	const { userId } = req;

	try {
		const user = await UserModel.findById(userId);
		const userFollowStats = await FollowerModel.findOne({ user: userId });
		//return user dan followstatsnya
		return res.status(200).json({ user, userFollowStats });
	} catch (error) {
		console.error(error);
		return res.status(500).send('Server ERROR');
	}
});

router.post('/', async (req, res) => {
	const { email, password } = req.body.user;

	//cek apakah email valid
	if (!isEmail(email)) return res.status(401).send('Email is invalid');

	//cek apakah password kurang dari 6
	if (password.length < 6)
		return res.status(401).send('Password must be atleast 6 characters');

	try {
		//cek apakah email ada di database?
		const User = await UserModel.findOne({
			email: email.toLowerCase(),
		}).select('+password');
		// console.log(email, password, User);
		if (!User) return res.status(401).send('Wrong email!');
		// cek password di database?
		const isPassword = await bcrypt.compare(password, User.password);
		if (!isPassword) return res.status(401).send('Wrong password!');

		// bikin jwt
		const payload = { userId: User._id };
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
