import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (req, res, next) => {
	try {
		const bearerHeader = req.headers['authorization']
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ')
			const bearerToken = bearer[1]
			req.token = bearerToken

			// verify token using jsonwebtoken module
			try {
				const decoded = jwt.verify(req.token, process.env.JWT_SECRET)
				req.decoded = decoded

				next()
			} catch (error) {
				res.status(400).send('Invalid token')
			}
		} else {
			res.status(400).send('Error: Forbidden, Authorization header is not defined')
		}
	} catch (error) {
		console.log(error)
		res.status(400).send(error.message)
	}

	// Comment this to enable authentication
	next()
}
