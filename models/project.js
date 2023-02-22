import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		_id: { type: String },
		name: String,
		inviteCode: String,
		canvas: String,
    thumbnail: String,
		library: [{ id: String, data: String }],
		roomId: String,
		roomKey: String,
		createdBy: String,
		isActive: Boolean,
	},
	{ timestamps: true }
)

export default mongoose.model('project', schema)
