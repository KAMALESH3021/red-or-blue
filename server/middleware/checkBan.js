import Ban from '../models/Ban.js'

export default async function checkBan(req, res, next) {
  const ban = await Ban.findOne({
    ip: req.ip,
    expiresAt: { $gt: new Date() }
  })

  if (ban) {
    const hoursLeft = Math.ceil(
      (new Date(ban.expiresAt) - new Date()) / 3600000
    )

    return res.status(403).json({
      error: `You are banned from creating games for ${hoursLeft} more hour(s).`
    })
  }

  next()
}