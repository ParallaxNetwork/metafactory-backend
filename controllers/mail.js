import nodemailer from 'nodemailer'

import { sendReturn } from '../utils/return.js'

export const mailSend = async (req, res) => {
	try {
		const { to, subject, text, html } = req.body

		let missingField = []
		to ? undefined : missingField.push('to')
		subject ? undefined : missingField.push('subject')
		text ? undefined : missingField.push('text')
		html ? undefined : missingField.push('html')

		if (missingField.length > 0) {
			return sendReturn(400, false, `Missing Field \n${missingField.join(', \n')}`, res)
		}

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			auth: {
				user: 'meta.factory.parallax@gmail.com',
				pass: 'pvyvvdoixnpavbvs',
			},
		})

		// transporter.verify().then(console.log).catch(console.error);

		transporter
			.sendMail({
				from: '"MetaFactory" <youremail@gmail.com>',
				to: to,
				subject: subject,
				text: text,
				html: html,
			})
			.then((info) => {
				console.log({ info })
			})
			.catch(console.error)

		return sendReturn(200, true, 'Sending Email', res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}
