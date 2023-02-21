import express from 'express'
import { userRegister, userLogin, userGet, userUpdate, userNonce } from '../controllers/user.js'

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/update', userUpdate)

router.get('/get', userGet)
router.get('/nonce', userNonce)

export default router