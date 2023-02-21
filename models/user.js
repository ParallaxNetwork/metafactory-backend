import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    name: String,
    wallet: String,
    email: String,
    twitter: String,
    isActive: Boolean
  },
  { timestamps: true }
)

export default mongoose.model('user', schema)