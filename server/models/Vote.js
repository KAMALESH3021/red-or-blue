import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  ip: String,

  deviceId: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    enum: ['blue', 'red'],
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
})

voteSchema.index(
  { gameId: 1, deviceId: 1 },
  { unique: true }
)

export default mongoose.model('Vote', voteSchema)