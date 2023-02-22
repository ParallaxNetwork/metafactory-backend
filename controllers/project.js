import Project from '../models/project.js'
import ProjectMember from '../models/projectMember.js'

import { isMember } from '../utils/project.js'
import { sendReturn } from '../utils/return.js'
import { nanoid } from 'nanoid'

export const projectCreate = async (req, res) => {
	try {
		const { name, thumbnail } = req.body

		if (!name) {
			return sendReturn(400, false, 'Missing field name', res)
		}

		const newProject = await new Project({
			_id: nanoid(),
			name: name,
			inviteCode: nanoid(),
			canvas: '',
			thumbnail: thumbnail ? thumbnail : '',
			roomId: '',
			roomKey: '',
			createdBy: req.user._id,
			isActive: true,
		}).save()

		return sendReturn(200, true, `Created project with Id ${newProject._id}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const projectInvite = async (req, res) => {
	try {
		const { inviteCode } = req.body

		if (!inviteCode) {
			return sendReturn(400, false, `Invite code empty`, res)
		}
		
		const currProject = await Project.findOne({ inviteCode: inviteCode, isActive: true })
		
		if (!currProject) {
			return sendReturn(400, false, `Project with invite code ${inviteCode} not found`, res)
		}

		const isActiveMember = await ProjectMember.findOne({
			userId: req.user._id,
			projectId: currProject._id,
			isActive: true,
		})

		if (isActiveMember) {
			return sendReturn(400, false, `Your Id ${req.user._id} is already a member in project ${currProject.name}`, res)
		}

		await new ProjectMember({
			_id: nanoid(),
			projectId: currProject._id,
			userId: req.user._id,
			isActive: true,
		}).save()

		return sendReturn(200, true, `Added ${req.user.name} into ${currProject.name}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const projectGet = async (req, res) => {
	try {
		const { id } = req.query
		if (id) {
			req.query._id = id
			delete req.query.id
		}
		const projects = await Project.find({ ...req.query, isActive: true })

		return sendReturn(200, true, projects, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const projectUpdate = async (req, res) => {
	try {
		const validateMember = await isMember(req.user._id, req.body.id, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		const currProject = await Project.findOne({ _id: req.body.id, isActive: true })

		for (const key in req.body) {
			if (key == 'name' || key == 'canvas' || key == 'roomId' || key == 'roomKey' || key == 'thumbnail') {
				currProject[key] = req.body[key]
			}
		}

		await currProject.save()

		return sendReturn(200, true, `Successfully updated project ${currProject.name}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}
