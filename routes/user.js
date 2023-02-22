import express from 'express'

import { userRegister, userLogin, userGet, userUpdate, userNonce } from '../controllers/user.js'
import { verifyJwt } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/update', verifyJwt, userUpdate)

router.get('/get', userGet)
router.get('/nonce', userNonce)

export default router