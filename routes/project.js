import express from 'express'

import { projectCreate, projectGet, projectInvite } from '../controllers/project.js'

const router = express.Router()

router.post('/create', projectCreate)
router.get('/get', projectGet)
router.post('/invite', projectInvite)

export default router
