import { fileUpload } from '../controllers/file.js'
import { verifyJwt } from '../middlewares/auth.js'

import express from 'express'

const router = express.Router()

router.post('/upload', verifyJwt, fileUpload)

export default router
