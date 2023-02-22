import Project from '../models/project.js'
import ProjectMember from '../models/projectMember.js'

export const isMember = async (userId, projectId, res) => {
	try {
		if (!projectId) {
			return {
				success: false,
				message: `Missing project id`,
			}
		}

		const currProject = await Project.findOne({ _id: projectId, isActive: true })

		if (!currProject) {
			return {
				success: false,
				message: `Project with id ${projectId} not found`,
			}
		}

		const isMember = await ProjectMember.findOne({ userId: userId, projectId: projectId, isActive: true })

		if (isMember) {
			return {
        success: true,
        message: "OK"
      }
		}

		return {
      success: false,
      message: ""
    }
	} catch (error) {
		return {
			success: false,
			message: `${error}`,
		}
	}
}
