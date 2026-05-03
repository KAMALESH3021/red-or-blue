import cron from 'node-cron'
import Game from '../models/Game.js'
import Vote from '../models/Vote.js'
import Ban from '../models/Ban.js'

cron.schedule('* * * * *', async () => {
  const now = new Date()

  const games = await Game.find({
    status: 'active',
    endsAt: { $lt: now }
  })

  for (const game of games) {
    const blueCount = await Vote.countDocuments({
      gameId: game._id,
      answer: 'blue'
    })

    const redCount = await Vote.countDocuments({
      gameId: game._id,
      answer: 'red'
    })

    await Game.findByIdAndUpdate(game._id, {
      status: 'ended',
      blueCount,
      redCount,
      totalVotes: blueCount + redCount,
      endedAt: new Date()
    })
  }

  await Ban.deleteMany({
    expiresAt: { $lt: now }
  })
})