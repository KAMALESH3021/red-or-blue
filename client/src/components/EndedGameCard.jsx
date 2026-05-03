import React from 'react'
import { useState } from 'react'
import api from '../api'

export default function EndedGameCard({
  game,
  myVote
}) {
  const [showResult, setShowResult] =
    useState(false)

  const [result, setResult] = useState(null)

  const bluePercent = game.totalVotes
    ? Math.round(
        (game.blueCount / game.totalVotes) * 100
      )
    : 0

  const redPercent = game.totalVotes
    ? Math.round(
        (game.redCount / game.totalVotes) * 100
      )
    : 0

  const loadResult = async () => {
    if (!result) {
      const res = await api.get(
        `/games/${game._id}/result`
      )

      setResult(res.data)
    }

    setShowResult(!showResult)
  }

  return (
    <div className='bg-slate-700 p-4 rounded-2xl flex flex-col gap-3'>
      <h3 className='font-bold'>
        {game.question}
      </h3>

      <div className='text-sm text-gray-300 flex flex-col gap-1'>
        <span>
          Ended at{' '}
          {new Date(game.endedAt).toLocaleString(
            'en-GB',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }
          )}
        </span>

        {game.totalVotes === 0 && (
          <span>
            No participants participated
          </span>
        )}
      </div>

      {myVote?.voted && (
        <>
          <div>
            🟦 {bluePercent}% vs 🟥{' '}
            {redPercent}%
          </div>

          <button
            onClick={loadResult}
            className='bg-white text-black py-2 rounded-xl'
          >
            {showResult
              ? 'Hide Result'
              : 'View My Result'}
          </button>

          {showResult && result && (
            <div className='bg-slate-800 p-4 rounded-xl flex flex-col gap-3'>
              {result.result ===
              'noVotes' ? (
                <div>
                  No one participated in
                  this game.
                </div>
              ) : (
                <>
                  <div>
                    You voted:{' '}
                    <span className='font-bold'>
                      {result.vote}
                    </span>
                  </div>

                  <div>
                    Winner:{' '}
                    <span className='font-bold'>
                      {result.winningSide}
                    </span>
                  </div>

                  <div className='bg-slate-700 p-3 rounded-lg'>
                    {result.message}
                  </div>

                  <div>
                    🟦 {result.blueCount} vs
                    🟥 {result.redCount}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
} 