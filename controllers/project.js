import Project from '../models/project.js'
import ProjectMember from '../models/projectMember.js'
import { nanoid } from 'nanoid'

export const projectCreate = async (req, res) => {
	try {
		const { name } = req.body
		
		if (!name) {
			return res.status(400).send('Error: Missing field name')
		}

		const newProject = await new Project({
			_id: nanoid(),
			name: name,
			createdBy: req.user.id,
		}).save()

		return res.status(200).send(`Success: Created project with Id ${newProject._id}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const projectInvite = async (req, res) => {
	try {
		const { inviteCode } = req.body

		if (!inviteCode) {
			return res.status(400).send(`Error: Invite code empty`)
		}

		const currProject = await Project.findOne({ inviteCode: inviteCode, isActive })

		if (!currProject) {
			return res.status(400).send(`Error: Project with invite code ${inviteCode} not found`)
		}

		await new ProjectMember({
			_id: nanoid(),
			projectId: currProject._id,
			userId: req.user.id,
		}).save()

		return res.status(200).send(`Success: Added ${req.user.name} into ${currProject.name}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const projectGet = async (req, res) => {
	try {
		const projects = await Project.find({ ...req.body, isActive })

		return res.status(200).send(projects)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}
