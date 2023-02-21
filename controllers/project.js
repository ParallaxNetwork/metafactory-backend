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
			// createdBy: req.user.id,
			createdBy: "testuser",
			isActive: true
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

		const currProject = await Project.findOne({ inviteCode: inviteCode, isActive: true })

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
		const projects = await Project.find({ ...req.body, isActive: true })

		return res.status(200).send(projects)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const projectUpdate = async (req, res) => {
	try {
		const { id } = req.body

		if (!id) {
			return res.status(400).send(`Error: Missing project id`)
		}

		const currProject = await Project.findOne({ _id: id, isActive: true })

		if (!currProject) {
			return res.status(400).send(`Error: Project with id ${id} not found`)
		}

		for (const key in req.body) {
			if (key !== 'name' && key !== 'canvas' && key !== 'library') {
				currProject[key] = req.body[key]
			}
		}

		await currProject.save()

		return res.status(200).send(`Success: Successfully updated project ${currProject.name}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}
