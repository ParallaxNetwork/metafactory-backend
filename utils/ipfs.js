import { ThirdwebStorage } from '@thirdweb-dev/storage'

const storage = new ThirdwebStorage({
  secretKey: process.env.TW_SECRET_KEY
})

export const ipfsStorageUpload = async (data) => {
	const uri = await storage.upload(data)
	const url = await storage.resolveScheme(uri)

	const cid = uri.replace('ipfs://', '')

	const res = {
		cid: cid,
		url: url,
	}

	return res
}

export const ipfsStorageDownload = async (cid) => {
	try {
		const uri = await storage.resolveScheme(`ipfs://${cid}`)
		const result = await storage.download(uri)

		return result
	} catch (error) {
		return error
	}
}
