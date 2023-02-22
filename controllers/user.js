import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { generateNonce, SiweMessage } from 'siwe'

import User from '../models/user.js'

import { sendReturn } from '../utils/return.js'
import { nanoid } from 'nanoid'

dotenv.config()

export const userRegister = async (req, res) => {
	try {
		const { id, name, wallet } = req.body

		let missingField = []
		id ? undefined : missingField.push('id')
		name ? undefined : missingField.push('name')
		wallet ? undefined : missingField.push('wallet')

		if (missingField.length > 0) {
			return sendReturn(400, false, `Missing Field \n${missingField.join(', \n')}`, res)
		}

		const currUser = await User.findOne({ _id: id, wallet: wallet, isActive: true })

		if (currUser) {
			return sendReturn(400, false, `User with wallet(${wallet}) and id(${id}) already registered`, res)
		}

		await User({
			_id: id,
			name: name,
			wallet: wallet,
			email: "",
			twitter: "",
			isActive: true,
		}).save()

		return sendReturn(200, true, `Registered User with Id ${id}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const userGet = async (req, res) => {
	try {
		const currUser = await User.findOne({ ...req.query, isActive: true })

		return sendReturn(200, true, currUser, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const userNonce = async (req, res) => {
	try {
		return sendReturn(200, true, generateNonce(), res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const userLogin = async (req, res) => {
	try {
		const { message, signature, wallet, id, nonce } = req.body

		let missingField = []
		message ? undefined : missingField.push('message')
		signature ? undefined : missingField.push('signature')
		wallet ? undefined : missingField.push('wallet')
		nonce ? undefined : missingField.push('nonce')

		if (missingField.length > 0) {
			return sendReturn(400, false, `Missing Field \n${missingField.join(', \n')}`, res)
		}

		let currUser = await User.findOne({ wallet: wallet, isActive: true })

		if (!currUser) {
			currUser = await new User({
				_id: nanoid(),
				name: wallet,
				wallet: wallet,
				email: "",
				twitter: "",
				isActive: true,
			}).save()
		}
		
		let siweMessage = new SiweMessage(message)
		const validation = await siweMessage.validate(signature)

		if (validation.nonce !== req.body.nonce) {
			return sendReturn(400, false, `Siwe verification failed with signature ${signature}`, res)
		}

		const token = jwt.sign(
			{
				wallet: wallet,
				id: currUser._id,
			},
			process.env.JWT_SECRET
		)

		return sendReturn(200, true, token, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const userUpdate = async (req, res) => {
	try {
		const currUser = req.user

		for (const key in req.body) {
			if (key == 'name' || key == 'email' || key == 'twitter') {
				currUser[key] = req.body[key]
			}
		}

		await currUser.save()
		
		return sendReturn(200, true, `Successfully updated user with Id ${currUser._id}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}
