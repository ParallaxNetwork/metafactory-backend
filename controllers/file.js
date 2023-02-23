import { ipfsStorageUpload } from '../utils/ipfs.js'
import { sendReturn } from '../utils/return.js'

export const fileUpload = async (req, res) => {
	try {
		if (!req.files.file) {
			return sendReturn(400, false, 'No files: file', res)
		}

		const file = req.files.file
		const result = await ipfsStorageUpload(file)

		return sendReturn(200, true, result, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}
