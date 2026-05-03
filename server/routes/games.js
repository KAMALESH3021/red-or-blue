import express from 'express'
import Game from '../models/Game.js'
import Vote from '../models/Vote.js'
import Ban from '../models/Ban.js'
import adminOnly from '../middleware/adminOnly.js'
import checkBan from '../middleware/checkBan.js'

const router = express.Router()

function getWinningSide(game) {
  let winningSide

  if (game.blueCount > game.redCount) {
    winningSide = 'blue'
  } else if (game.redCount > game.blueCount) {
    winningSide = 'red'
  } else {
    if (game.tieRule === 'blueWins') {
      winningSide = 'blue'
    } else if (game.tieRule === 'redWins') {
      winningSide = 'red'
    } else {
      winningSide = 'draw'
    }
  }

  return winningSide
}

router.get('/', async (req, res) => {
  const now = new Date()

  const activeGamesList = await Game.find({
    status: 'active'
  })

  for (const game of activeGamesList) {
    if (new Date() > new Date(game.endsAt)) {
      const votes = await Vote.find({
        gameId: game._id
      })

      let blueCount = 0
      let redCount = 0

      votes.forEach(vote => {
        if (vote.answer === 'blue') {
          blueCount++
        } else if (vote.answer === 'red') {
          redCount++
        }
      })

      game.status = 'ended'
      game.blueCount = blueCount
      game.redCount = redCount
      game.totalVotes = votes.length
      game.endedAt = new Date()

      await game.save()
    }
  }

  const last24h = new Date(
    now.getTime() - 24 * 60 * 60 * 1000
  )

  const endedGames = await Game.find({
    status: 'ended',
    endedAt: { $gte: last24h }
  }).sort({ endedAt: -1 })

  const activeGames = await Game.find({
    status: 'active'
  }).sort({ createdAt: -1 })

  res.json({
    endedGames,
    activeGames
  })
})

router.post('/', checkBan, async (req, res) => {
  try {
    const {
      question,
      blueLabel,
      redLabel,
      duration,
      tieRule,
      messages
    } = req.body

    if (duration < 600 || duration > 172800) {
      return res.status(400).json({
        error:
          'Duration must be between 10 minutes and 2 days'
      })
    }

    const game = await Game.create({
      question,
      blueLabel,
      redLabel,
      duration,
      tieRule,
      messages,
      creatorIp: req.ip,
      endsAt: new Date(
        Date.now() + duration * 1000
      )
    })

    res.status(201).json(game)
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.get('/:id', async (req, res) => {
  const game = await Game.findById(
    req.params.id
  )

  if (!game || game.status === 'deleted') {
    return res.status(404).json({
      error: 'Game not found'
    })
  }

  if (
    game.status === 'active' &&
    new Date() > new Date(game.endsAt)
  ) {
    const votes = await Vote.find({
      gameId: game._id
    })

    let blueCount = 0
    let redCount = 0

    votes.forEach(vote => {
      if (vote.answer === 'blue') {
        blueCount++
      } else if (vote.answer === 'red') {
        redCount++
      }
    })

    game.status = 'ended'
    game.blueCount = blueCount
    game.redCount = redCount
    game.totalVotes = votes.length
    game.endedAt = new Date()

    await game.save()
  }

  const data = {
    _id: game._id,
    question: game.question,
    blueLabel: game.blueLabel,
    redLabel: game.redLabel,
    endsAt: game.endsAt,
    status: game.status,
    totalVotes: game.totalVotes
  }

  if (game.status === 'ended') {
    data.blueCount = game.blueCount
    data.redCount = game.redCount
  }

  res.json(data)
})

router.post('/:id/vote', async (req, res) => {
  const game = await Game.findById(
    req.params.id
  )

  if (!game || game.status === 'deleted') {
    return res.status(404).json({
      error: 'Game not found'
    })
  }

  if (
    game.status === 'ended' ||
    new Date() > new Date(game.endsAt)
  ) {
    return res.status(403).json({
      error: 'Voting has ended'
    })
  }

  const { answer } = req.body

  await Vote.findOneAndUpdate(
    {
      gameId: game._id,
      deviceId:
        req.headers['x-device-id']
    },
    {
      answer,
      ip: req.ip,
      deviceId:
        req.headers['x-device-id'],
      votedAt: new Date()
    },
    {
      upsert: true,
      new: true
    }
  )

  const totalVotes =
    await Vote.countDocuments({
      gameId: game._id
    })

  await Game.findByIdAndUpdate(
    game._id,
    {
      totalVotes
    }
  )

  res.json({
    success: true
  })
})

router.get('/:id/myvote', async (req, res) => {
  const vote = await Vote.findOne({
    gameId: req.params.id,
    deviceId:
      req.headers['x-device-id']
  })

  if (!vote) {
    return res.json({
      voted: false,
      answer: null
    })
  }

  res.json({
    voted: true,
    answer: vote.answer
  })
})

router.get('/:id/result', async (req, res) => {
  const game = await Game.findById(
    req.params.id
  )

  if (!game || game.status !== 'ended') {
    return res.status(404).json({
      error: 'Result unavailable'
    })
  }

  const vote = await Vote.findOne({
    gameId: game._id,
    deviceId:
      req.headers['x-device-id']
  })

  if (!vote) {
    return res.status(403).json({
      error:
        'You did not participate in this game'
    })
  }

  if (game.totalVotes === 0) {
    return res.json({
      result: 'noVotes'
    })
  }

  const winningSide =
    getWinningSide(game)

  if (winningSide === 'draw') {
    return res.json({
      result: 'draw',
      message:
        'The game ended in a draw. Nobody wins this time.',
      vote: vote.answer,
      winningSide,
      blueCount: game.blueCount,
      redCount: game.redCount,
      totalVotes: game.totalVotes
    })
  }

  const userSide = vote.answer

  const key =
    userSide +
    (userSide === winningSide
      ? 'Win'
      : 'Lose')

  res.json({
    result: key,
    message: game.messages[key],
    vote: userSide,
    winningSide,
    blueCount: game.blueCount,
    redCount: game.redCount,
    totalVotes: game.totalVotes
  })
})

router.delete(
  '/:id',
  adminOnly,
  async (req, res) => {
    const game = await Game.findById(
      req.params.id
    )

    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      })
    }

    await Game.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deleted',
        deletedAt: new Date(),
        deletedBy: req.ip
      }
    )

    if (
      game.creatorIp !==
      process.env.ADMIN_IP
    ) {
      await Ban.create({
        ip: game.creatorIp,
        bannedAt: new Date(),
        expiresAt: new Date(
          Date.now() +
            24 * 60 * 60 * 1000
        ),
        reason:
          'game deleted by admin',
        deletedGameId: game._id
      })
    }

    res.json({
      success: true
    })
  }
)

export default router