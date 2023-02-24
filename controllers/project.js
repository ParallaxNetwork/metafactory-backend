import Project from '../models/project.js'
import ProjectMember from '../models/projectMember.js'
import User from '../models/user.js'

import { isMember } from '../utils/project.js'
import { sendReturn } from '../utils/return.js'
import { nanoid } from 'nanoid'

export const projectCreate = async (req, res) => {
	try {
		const { name, thumbnail, canvas, roomId, roomKey } = req.body

		if (!name) {
			return sendReturn(400, false, 'Missing field name', res)
		}

		const newProject = await new Project({
			_id: nanoid(),
			name: name,
			inviteCode: nanoid(),
			canvas: canvas ? canvas : '',
			thumbnail: thumbnail ? thumbnail : '',
			roomId: roomId ? roomId : '',
			roomKey: roomKey ? roomKey : '',
			createdBy: req.user._id,
			isPublic: false,
			isActive: true,
		}).save()

		await new ProjectMember({
			_id: nanoid(),
			userId: req.user._id,
			projectId: newProject._id,
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
		let { projectId, isPublic, wallet, inviteCode } = req.query

		if (inviteCode) {
			const project = await Project.findOne({ inviteCode: inviteCode, isActive: true })

			if (!project) {
				return sendReturn(400, false, `Project with invite code ${inviteCode} not found`, res)
			}

			return sendReturn(200, true, project, res)
		}

		if (isPublic == 'true') {
			isPublic = true
		} else if (isPublic == 'false') {
			isPublic = false
		}

		let currUser = {}
		if (wallet) {
			currUser = await User.findOne({ wallet: wallet, isActive: true })
			if (!currUser) {
				return sendReturn(400, false, `User with wallet ${wallet} not found`, res)
			}
		}

		let query = {}
		projectId ? (query['projectId'] = projectId) : undefined
		wallet ? (query['userId'] = currUser._id) : (query['userId'] = req.user._id)
		query['isActive'] = true
		
		const projects = await ProjectMember.find({ ...query })
		
		let result = []

		for (const { projectId } of projects) {
			const project = await Project.findOne({ _id: projectId, isActive: true })
			
			if (!project.isPublic && !wallet) {
				if (!isPublic || isPublic == null) {
					result.push(project)
				}
			} else if (project.isPublic) {
				console.log(isPublic)
				if (isPublic == null || isPublic == true) {
					result.push(project)
				}
			}
		}

		return sendReturn(200, true, result, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const projectUpdate = async (req, res) => {
	try {
		const validateMember = await isMember(req.user._id, req.body.projectId, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		const currProject = await Project.findOne({ _id: req.body.projectId, isActive: true })

		for (const key in req.body) {
			if (
				key == 'name' ||
				key == 'canvas' ||
				key == 'roomId' ||
				key == 'roomKey' ||
				key == 'thumbnail' ||
				key == 'isPublic'
			) {
				currProject[key] = req.body[key]
			}
		}

		await currProject.save()

		return sendReturn(200, true, `Successfully updated project ${currProject.name}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const projectDelete = async (req, res) => {
	try {
		const validateMember = await isMember(req.user._id, req.body.id, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		let currProject = await Project.findOne({ _id: req.body.id, isActive: true })

		if (!currProject) {
			return sendReturn(400, false, `Project with id ${currProject._id} not found`, res)
		}

		currProject.isActive = false
		await currProject.save()

		let projectMembers = await ProjectMember.find({ projectId: currProject._id })
		for (let member of projectMembers) {
			member.isActive = false
			await member.save()
		}

		return sendReturn(200, true, `Successfully deleted project ${currProject.name}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const projectGetMember = async (req, res) => {
	try {
		const { projectId } = req.query
		
		if (!projectId) {
			return sendReturn(400, false, `Project id empty`, res)
		}

		const validateMember = await isMember(req.user._id, projectId, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		const projectMembers = await ProjectMember.find({ projectId: projectId, isActive: true })

		let _projectMembers = []
		for(let i=0; i<projectMembers.length; i++) {
			// add User data by userId
			const userData = await User.findOne({ _id: projectMembers[i].userId, isActive: true })
			
			// delete unnecessary user data
			delete userData.createdAt
			delete userData.updatedAt

			_projectMembers.push({
				...projectMembers[i],
				user: userData
			})
		}

		return sendReturn(200, true, projectMembers, res)
	} catch (error) {
		
	}
}