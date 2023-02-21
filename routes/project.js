import express from 'express'

import { projectCreate, projectGet, projectInvite, projectUpdate } from '../controllers/project.js'

const router = express.Router()

router.post('/create', projectCreate)
router.get('/get', projectGet)
router.post('/invite', projectInvite)
router.post('/update', projectUpdate)

export default router
