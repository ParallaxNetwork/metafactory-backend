import { mailSend } from '../controllers/mail.js'

import express from 'express'

const router = express.Router()

router.post('/send', mailSend)

export default router