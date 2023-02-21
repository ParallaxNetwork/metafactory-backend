import { fileUpload } from '../controllers/file.js'

import express from 'express'

const router = express.Router()

router.post('/upload', fileUpload)

export default router
