import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    projectId: String,
    data: String,
    isActive: Boolean
  },
  { timestamps: true }
)

export default mongoose.model('library', schema)