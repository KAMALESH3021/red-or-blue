import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  blueLabel: {
    type: String,
    default: 'Blue'
  },
  redLabel: {
    type: String,
    default: 'Red'
  },
  duration: {
    type: Number,
    required: true,
    min: 600,
    max: 172800
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endsAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'deleted'],
    default: 'active'
  },
  endedAt: Date,
  blueCount: {
    type: Number,
    default: 0
  },
  redCount: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  creatorIp: String,
  deletedAt: Date,
  deletedBy: String,
  tieRule: {
    type: String,
    enum: ['blueWins', 'redWins', 'draw'],
    default: 'draw'
  },
  messages: {
    blueWin: {
      type: String,
      required: true
    },
    blueLose: {
      type: String,
      required: true
    },
    redWin: {
      type: String,
      required: true
    },
    redLose: {
      type: String,
      required: true
    },
    draw: String
  }
})

export default mongoose.model('Game', gameSchema)