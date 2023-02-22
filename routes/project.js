import express from 'express'

import { projectCreate, projectGet, projectInvite, projectUpdate } from '../controllers/project.js'
import { verifyJwt } from '../middlewares/auth.js'

const router = express.Router()

router.post('/create', verifyJwt, projectCreate)
router.post('/invite', verifyJwt, projectInvite)
router.post('/update', verifyJwt, projectUpdate)

router.get('/get', verifyJwt, projectGet)

export default router
