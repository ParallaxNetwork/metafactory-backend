import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { generateNonce, SiweMessage } from 'siwe'

import User from '../models/user.js'

dotenv.config()

export const userRegister = async (req, res) => {
	try {
		const { id, name, wallet } = req.body

		let missingField = []
		id ? undefined : missingField.push('id')
		name ? undefined : missingField.push('name')
		wallet ? undefined : missingField.push('wallet')

		if (missingField.length > 0) {
			return res.status(400).send(`Error: Missing Field \n${missingField.join(', \n')}`)
		}

		const currUser = await User.findOne({ _id: id, wallet: wallet, isActive: true })

		if (currUser) {
			return res.status(400).send(`Error: User with wallet(${wallet}) and id(${id}) already registered`)
		}

		await User({
			_id: id,
			name: name,
			wallet: wallet,
			isActive: true,
		}).save()

		return res.status(200).send(`Success: Registered User with Id ${id}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const userGet = async (req, res) => {
	try {
		const currUser = await User.findOne({ ...req.query, isActive: true })

		return res.status(200).send(currUser)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const userNonce = async (req, res) => {
	try {
		return res.status(200).send(generateNonce())
	} catch (error) {
		return res.status(500).send(`Error: error`)
	}
}

export const userLogin = async (req, res) => {
	try {
		const { message, signature, wallet, id, nonce } = req.body

		let missingField = []
		message ? undefined : missingField.push('message')
		signature ? undefined : missingField.push('signature')
		wallet ? undefined : missingField.push('wallet')
		id ? undefined : missingField.push('id')
		nonce ? undefined : missingField.push('nonce')

		if (missingField.length > 0) {
			return res.status(400).send(`Error: Missing Field \n${missingField.join(', \n')}`)
		}

		const currUser = await User.findOne({ wallet: wallet, _id: id, isActive: true })

		if (!currUser) {
			return res.status(400).send(`Error: No Current User with wallet(${wallet}) and id(${id})`)
		}
		
		let siweMessage = new SiweMessage(message)
		const validation = await siweMessage.validate(signature)

		if (validation.nonce !== req.body.nonce) {
			return res.status(400).send(`Error: Siwe verification failed with signature ${signature}`)
		}

		const token = jwt.sign(
			{
				wallet: wallet,
				id: id,
			},
			process.env.JWT_SECRET
		)

		return res.status(200).send(`Success: Token ${token}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const userUpdate = async (req, res) => {
	try {
		const currUser = await User.findOne({ _id: req.user.id, isActive: true })
		if (!currUser) {
			return res.status(400).send(`Error: User with Id ${req.id} not found`)
		}

		for (const key in req.body) {
			if (key !== 'name' && key !== 'email' && key !== 'twitter') {
				currUser[key] = req.body[key]
			}
		}

		await currUser.save()

		return res.status(200).send(`Success: Successfully updated ${req.id}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}
