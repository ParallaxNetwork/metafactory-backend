import express from 'express'

import { libraryAdd, libraryDelete, libraryGet, libraryUpdate } from '../controllers/library.js'
import { verifyJwt } from '../middlewares/auth.js'

const router = express.Router()

router.post('/add', verifyJwt, libraryAdd)
router.post('/delete', verifyJwt, libraryDelete)
router.post('/update', verifyJwt, libraryUpdate)

router.get('/get', verifyJwt, libraryGet)

export default router
