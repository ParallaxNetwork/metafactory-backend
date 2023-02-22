import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()
import User from '../models/user.js'

export const verifyJwt = async (req, res, next) => {
	try {
		const bearerHeader = req.headers['authorization']
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ')
			const bearerToken = bearer[1]
			req.token = bearerToken

			// verify token using jsonwebtoken module
			try {
				const decoded = jwt.verify(req.token, process.env.JWT_SECRET)
				const currUser = await User.findOne({ _id: decoded.id, wallet: decoded.wallet, isActive: true })
				
				if (!currUser) {
					return res.status(400).send(`Error: User with Id ${decoded.id} not found`)
				}

				req.user = currUser
				next()
			} catch (error) {
				res.status(400).send('Invalid token')
			}
		} else {
			res.status(400).send('Error: Forbidden, Authorization header is not defined')
		}
	} catch (error) {
		res.status(400).send(error.message)
	}

	// Comment this to enable authentication
	// next()
}
