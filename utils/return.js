export const sendReturn = (status, success, message, res) => {
	res.status(status).send({
		success: success,
		message: message,
	})
}
