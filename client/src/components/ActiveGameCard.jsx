import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function ActiveGameCard({
  game,
  refresh
}) {
  const [isAdmin, setIsAdmin] =
    useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const res = await api.get('/me')

      setIsAdmin(res.data.isAdmin)
    } catch {}
  }

  const deleteGame = async () => {
    const confirmDelete = window.confirm(
      'Delete this game?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(
        `/games/${game._id}`
      )

      refresh()
    } catch {
      alert('Failed to delete game')
    }
  }

  return (
    <div className='bg-slate-700 p-4 rounded-2xl flex flex-col gap-4'>
      <h3 className='font-bold text-xl break-words'>
        {game.question}
      </h3>

      <div className='text-gray-300'>
        {game.totalVotes} participants
      </div>

      <Link
        to={`/game/${game._id}`}
        className='bg-white text-black text-center py-3 rounded-xl font-bold hover:bg-gray-200 transition'
      >
        Open Game
      </Link>

      {isAdmin && (
        <button
          onClick={deleteGame}
          className='bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition'
        >
          Delete Game
        </button>
      )}
    </div>
  )
}