import { ipfsStorageUpload } from '../utils/ipfs.js'

export const fileUpload = async (req, res) => {
	try {
		if (!req.files.file) {
			return res.status(400).send('No files: file')
		}

		const file = req.files.file
		const { cid, url } = await ipfsStorageUpload(file)

		return res.status(200).send(`Success: \ncid: ${cid} \nurl: ${url}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}
