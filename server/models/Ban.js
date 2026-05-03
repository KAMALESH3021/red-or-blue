import mongoose from 'mongoose'

const banSchema = new mongoose.Schema({
  ip: {
    type: String,
    unique: true,
    required: true
  },
  bannedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  reason: String,
  deletedGameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }
})

export default mongoose.model('Ban', banSchema)