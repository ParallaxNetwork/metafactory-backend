import nodemailer from 'nodemailer'

export const mailSend = async (req, res) => {
	try {
		const { to, subject, text, html } = req.body

		let missingField = []
		to ? undefined : missingField.push('to')
		subject ? undefined : missingField.push('subject')
		text ? undefined : missingField.push('text')
		html ? undefined : missingField.push('html')

		if (missingField.length > 0) {
			return res.status(400).send(`Error: Missing Field \n${missingField.join(', \n')}`)
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

		return res.status(200).send('Success: Sending Email')
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}
