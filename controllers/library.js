import Library from '../models/library.js'

import { sendReturn } from '../utils/return.js'
import { isMember } from '../utils/project.js'
import { nanoid } from 'nanoid'

export const libraryAdd = async (req, res) => {
	try {
		const { projectId, data } = req.body

		let missingField = []
		projectId ? undefined : missingField.push('projectId')
		data ? undefined : missingField.push('data')

		if (missingField.length > 0) {
			return sendReturn(400, false, `Missing Field \n${missingField.join(', \n')}`, res)
		}

		const validateMember = await isMember(req.user._id, projectId, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		const newLibrary = await new Library({
			_id: nanoid(),
			projectId: projectId,
			data: data,
			isActive: true,
		}).save()

		return sendReturn(200, true, `Added asset ${newLibrary._id} into projectId ${projectId}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const libraryGet = async (req, res) => {
	try {
		const { id, projectId } = req.query

		if (id) {
			req.query._id = id
			delete req.query.id
		}

		if (!projectId) {
			return sendReturn(400, false, 'Missing projectId', res)
		}

		const validateMember = await isMember(req.user._id, projectId, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		const libraries = await Library.find({ ...req.query, isActive: true })

		return sendReturn(200, true, libraries, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const libraryUpdate = async (req, res) => {
	try {
		const { id, projectId, data } = req.body

		let missingField = []
		id ? undefined : missingField.push('id')
		projectId ? undefined : missingField.push('projectId')
		data ? undefined : missingField.push('data')

		if (missingField.length > 0) {
			return sendReturn(400, false, `Missing Field \n${missingField.join(', \n')}`, res)
		}

		const validateMember = await isMember(req.user._id, projectId, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		const currLibrary = await Library.findOne({ _id: id, projectId: projectId, isActive: true})

		if (!currLibrary) {
			return sendReturn(400, false, `Library with id ${id} not found`, res)
		}

		currLibrary.data = data
		currLibrary.save()

		return sendReturn(200, true, `Successfully updated library with id ${id}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}

export const libraryDelete = async (req, res) => {
	try {
		const { id, projectId } = req.body

		let missingField = []
		id ? undefined : missingField.push('id')
		projectId ? undefined : missingField.push('projectId')

		if (missingField.length > 0) {
			return sendReturn(400, false, `Missing Field \n${missingField.join(', \n')}`, res)
		}

		const validateMember = await isMember(req.user._id, projectId, res)
		if (!validateMember.success) {
			return sendReturn(400, false, validateMember.message, res)
		}

		let currLibrary = await Library.findOne({ _id: id, isActive: true})

		if (!currLibrary) {
			return sendReturn(400, false, `Library with id ${id} not found`, res)
		}
		
		currLibrary.isActive = false
		currLibrary.save()

		return sendReturn(200, true, `Successfully deleted library with id ${id}`, res)
	} catch (error) {
		return sendReturn(500, false, String(error), res)
	}
}
