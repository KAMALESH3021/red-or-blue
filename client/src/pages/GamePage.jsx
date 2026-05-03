import React from 'react'
import { useEffect, useState } from 'react'

import gameImage from '../assets/game.png'
import bgGif from '../assets/background.gif'

import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

import api from '../api'
import VoteButtons from '../components/VoteButtons'

export default function GamePage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const [game, setGame] = useState(null)

  const [selected, setSelected] =
    useState(null)

  const [timeLeft, setTimeLeft] =
    useState('')

  useEffect(() => {
    loadGame()
  }, [])

  useEffect(() => {
    if (!game) return

    updateTimer()

    const interval = setInterval(() => {
      updateTimer()
    }, 1000)

    return () =>
      clearInterval(interval)
  }, [game])

  const loadGame = async () => {
    try {
      const res = await api.get(
        `/games/${id}`
      )

      if (
        res.data.status === 'ended'
      ) {
        navigate('/')
        window.location.reload()
        return
      }

      setGame(res.data)

      const voteRes = await api.get(
        `/games/${id}/myvote`
      )

      if (voteRes.data.voted) {
        setSelected(
          voteRes.data.answer
        )
      }
    } catch {
      navigate('/')
    }
  }

  const updateTimer = async () => {
    if (!game) return

    const diff =
      new Date(game.endsAt) -
      new Date()

    if (diff <= 0) {
      try {
        await api.get(
          `/games/${id}`
        )
      } catch {}

      navigate('/')
      window.location.reload()
      return
    }

    const hours = Math.floor(
      diff / (1000 * 60 * 60)
    )

    const mins = Math.floor(
      (diff %
        (1000 * 60 * 60)) /
        (1000 * 60)
    )

    const secs = Math.floor(
      (diff % (1000 * 60)) /
        1000
    )

    setTimeLeft(
      `${hours}h ${mins}m ${secs}s`
    )
  }

  const vote = async answer => {
    await api.post(
      `/games/${id}/vote`,
      {
        answer
      }
    )

    setSelected(answer)
  }

  if (!game) return null

  return (
    <div className='relative min-h-screen overflow-hidden'>

      <div
        className='fixed inset-0 -z-10 bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${bgGif})`,
          backgroundSize: 'cover'
        }}
      />

      <div className='min-h-screen bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-3 sm:p-5'>

        <div className='w-full max-w-2xl flex flex-col gap-6 sm:gap-8'>

          <Link
            to='/'
            className='w-fit bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl transition text-sm sm:text-base'
          >
            ← Back
          </Link>

          <div className='flex justify-between text-sm sm:text-lg'>
            <div className='font-bold'>
              {timeLeft}
            </div>

            <div className='font-bold'>
              {game.totalVotes}{' '}
              participants
            </div>
          </div>

          <h1 className='text-2xl sm:text-4xl font-black text-center break-words'>
            {game.question}
          </h1>

          <img
            src={gameImage}
            alt='game'
            className='w-full h-[220px] sm:h-[320px] object-cover rounded-2xl'
          />

          <VoteButtons
            blueLabel={
              game.blueLabel
            }
            redLabel={
              game.redLabel
            }
            selected={selected}
            onVote={vote}
          />

        </div>
      </div>
    </div>
  )
}
