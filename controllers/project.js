import Project from '../models/project.js'
import ProjectMember from '../models/projectMember.js'
import { nanoid } from 'nanoid'

export const projectCreate = async (req, res) => {
	try {
		const { name, thumbnail } = req.body

		if (!name) {
			return res.status(400).send('Error: Missing field name')
		}

		const newProject = await new Project({
			_id: nanoid(),
			name: name,
			inviteCode: nanoid(),
			canvas: '',
			thumbnail: thumbnail ? thumbnail : '',
			library: [],
			roomId: '',
			roomKey: '',
			createdBy: req.user._id,
			isActive: true,
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

		const isActiveMember = await ProjectMember.findOne({
			userId: req.user._id,
			projectId: currProject._id,
			isActive: true,
		})

		if (isActiveMember) {
			return res.status(400).send(`Error: Your Id ${req.user._id} is already a member in project ${currProject.name}`)
		}

		await new ProjectMember({
			_id: nanoid(),
			projectId: currProject._id,
			userId: req.user._id,
			isActive: true,
		}).save()

		return res.status(200).send(`Success: Added ${req.user.name} into ${currProject.name}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
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

		const isMember = await ProjectMember.findOne({ userId: req.user._id, projectId: id, isActive: true })

		if (!isMember) {
			return res.status(400).send(`Error: Your Id ${req.user._id} is not member of project ${id}`)
		}

		for (const key in req.body) {
			if (
				key == 'name' ||
				key == 'canvas' ||
				key == 'library' ||
				key == 'roomId' ||
				key == 'roomKey' ||
				key == 'thumbnail'
			) {
				currProject[key] = req.body[key]
			}
		}

		await currProject.save()

		return res.status(200).send(`Success: Successfully updated project ${currProject.name}`)
	} catch (error) {
		return res.status(500).send(`Error: ${error}`)
	}
}

export const libraryAdd = async (req, res) => {
	try {
		return res.status(200).send(`Success: OK`)
	} catch (error) {
		return res.status(500).send(`Error: error`)
	}
}

export const libraryGet = async (req, res) => {
	try {
		return res.status(200).send(`Success: OK`)
	} catch (error) {
		return res.status(500).send(`Error: error`)
	}
}

export const libraryUpdate = async (req, res) => {
	try {
		return res.status(200).send(`Success: OK`)
	} catch (error) {
		return res.status(500).send(`Error: error`)
	}
}

export const libraryDelete = async (req, res) => {
	try {
		return res.status(200).send(`Success: OK`)
	} catch (error) {
		return res.status(500).send(`Error: error`)
	}
}