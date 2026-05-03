import express from 'express'

const router = express.Router()

router.get('/me', (req, res) => {
  res.json({
    isAdmin: req.ip === process.env.ADMIN_IP
  })
})

export default router