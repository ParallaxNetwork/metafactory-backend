import { mailSend } from '../controllers/mail.js'
import { verifyJwt } from '../middlewares/auth.js'

import express from 'express'

const router = express.Router()

router.post('/send', verifyJwt, mailSend)

export default router