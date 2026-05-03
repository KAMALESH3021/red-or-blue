import React from 'react'
import { Link } from 'react-router-dom'

export default function GameCard({ game, isAdmin, onDelete }) {
  return (
    <div className='bg-slate-800 p-5 rounded-2xl flex flex-col gap-4'>
      <div className='flex items-start justify-between gap-4'>
        <h2 className='text-lg font-bold'>{game.question}</h2>

        {isAdmin && (
          <button
            onClick={() => onDelete(game._id)}
            className='text-red-400 text-xl'
          >
            🗑
          </button>
        )}
      </div>

      <div className='text-gray-300'>
        {game.totalVotes} participants
      </div>

      <Link
        to={`/game/${game._id}`}
        className='bg-white text-black text-center py-3 rounded-xl font-semibold'
      >
        Open Game
      </Link>
    </div>
  )
}