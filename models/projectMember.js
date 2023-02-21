import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: String,
    projectId: String
  },
  { timestamps: true }
)

export default mongoose.model('projectMember', schema)