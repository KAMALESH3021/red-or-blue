import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import gamesRoutes from './routes/games.js'
import adminRoutes from './routes/admin.js'

import './jobs/gameExpiry.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

app.set('trust proxy', 1)

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)

app.use(express.json())

app.use('/api/games', gamesRoutes)
app.use('/api', adminRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected')

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      )
    })
  })
  .catch(err => console.log(err))