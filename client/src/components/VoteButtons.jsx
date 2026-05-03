import React from 'react'

export default function VoteButtons({
  blueLabel,
  redLabel,
  selected,
  onVote
}) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 w-full'>
      <button
        onClick={() => onVote('red')}
        className={`p-6 rounded-2xl text-xl font-bold transition ${
          selected === 'red'
            ? 'bg-red-500 ring-4 ring-white'
            : 'bg-red-700'
        }`}
      >
        {redLabel}
      </button>

      <button
        onClick={() => onVote('blue')}
        className={`p-6 rounded-2xl text-xl font-bold transition ${
          selected === 'blue'
            ? 'bg-blue-500 ring-4 ring-white'
            : 'bg-blue-700'
        }`}
      >
        {blueLabel}
      </button>
    </div>
  )
}