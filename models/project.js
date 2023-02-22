import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		_id: { type: String },
		name: String,
		inviteCode: String,
		canvas: String,
    thumbnail: String,
		roomId: String,
		roomKey: String,
		createdBy: String,
		isPublic: Boolean,
		isActive: Boolean,
	},
	{ timestamps: true }
)

export default mongoose.model('project', schema)
