import React from 'react'
import { useEffect, useState } from 'react'
import api from '../api'

import bgGif from '../assets/background.gif'

import GameCard from '../components/GameCard'
import EndedGameCard from '../components/EndedGameCard'
import CreateGameModal from '../components/CreateGameModal'

export default function Home() {
  const [games, setGames] = useState([])

  const [endedGames, setEndedGames] =
    useState([])

  const [isAdmin, setIsAdmin] =
    useState(false)

  const [open, setOpen] =
    useState(false)

  const [showModal, setShowModal] =
    useState(false)

  const [votes, setVotes] = useState({})

  const loadGames = async () => {
    const res = await api.get('/games')

    setGames(res.data.activeGames)

    setEndedGames(res.data.endedGames)

    for (const game of res.data.endedGames) {
      const voteRes = await api.get(
        `/games/${game._id}/myvote`
      )

      setVotes(prev => ({
        ...prev,
        [game._id]: voteRes.data
      }))
    }
  }

  useEffect(() => {
    loadGames()

    api.get('/me').then(res => {
      setIsAdmin(res.data.isAdmin)
    })
  }, [])

  const deleteGame = async id => {
    await api.delete(`/games/${id}`)

    setGames(prev =>
      prev.filter(g => g._id !== id)
    )
  }

  return (
    <div className='relative min-h-screen overflow-hidden'>

      <div
        className='fixed inset-0 -z-10 bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${bgGif})`,
          backgroundSize: 'cover'
        }}
      />

      <div className='min-h-screen bg-black/40 backdrop-blur-sm'>
        <div className='p-3 sm:p-4 max-w-5xl mx-auto'>

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>

            <div className='flex flex-row gap-2 flex-wrap'>
              <h1 className='text-3xl sm:text-4xl font-bold text-red-600'>
                Red
              </h1>

              <h1 className='text-3xl sm:text-4xl font-bold text-gray-300'>
                or
              </h1>

              <h1 className='text-3xl sm:text-4xl font-bold text-blue-600'>
                Blue
              </h1>
            </div>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className='w-full sm:w-auto bg-green-500 hover:bg-green-600 px-5 py-3 rounded-2xl font-bold transition'
            >
              Create your game
            </button>

          </div>

          <div className='mb-8'>
            <button
              onClick={() =>
                setOpen(!open)
              }
              className='w-full bg-slate-800/80 hover:bg-slate-700/80 p-4 rounded-2xl text-left transition backdrop-blur-md text-sm sm:text-base'
            >
              Game Results (
              {endedGames.length}) ▾
            </button>

            {open && (
              <div className='grid gap-4 mt-4'>
                {endedGames.map(
                  game => (
                    <EndedGameCard
                      key={game._id}
                      game={game}
                      myVote={
                        votes[
                          game._id
                        ]
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>

          <div className='grid gap-5'>
            {games.map(game => (
              <GameCard
                key={game._id}
                game={game}
                isAdmin={isAdmin}
                onDelete={
                  deleteGame
                }
              />
            ))}
          </div>

          {showModal && (
            <CreateGameModal
              close={() =>
                setShowModal(false)
              }
              refresh={loadGames}
            />
          )}

        </div>
      </div>
    </div>
  )
}