export default function adminOnly(req, res, next) {
  if (req.ip !== process.env.ADMIN_IP) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  next()
}