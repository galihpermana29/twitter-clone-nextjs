const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
	try {
		// console.log(req.userId, 'userid');
		//jika request yang masuk ga mengirimkan authorization header
		if (!req.headers.authorization) {
			return res.status(401).send('Unauthorized');
		}
		//verifikasi jwt token yang dikirim dari header authorization
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.jwtSecret
		);
		req.userId = userId;
		// console.log(req, 'request incoming');
		next();
	} catch (error) {
		console.error(error);
		return res.status(401).send('Unauthorized');
	}
};
