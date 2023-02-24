import express from 'express'

import { projectCreate, projectDelete, projectGet, projectInvite, projectUpdate, projectGetMember } from '../controllers/project.js'
import { verifyJwt } from '../middlewares/auth.js'

const router = express.Router()

router.post('/create', verifyJwt, projectCreate)
router.post('/invite', verifyJwt, projectInvite)
router.post('/update', verifyJwt, projectUpdate)
router.post('/delete', verifyJwt, projectDelete)

router.get('/get', verifyJwt, projectGet)
router.get('/get/members', verifyJwt, projectGetMember)

export default router
