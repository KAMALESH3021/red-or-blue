import React from 'react'

export default function Timer({ endsAt }) {
  const diff = new Date(endsAt) - new Date()

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff / (1000 * 60)) % 60)
  const secs = Math.floor((diff / 1000) % 60)

  return (
    <div className='text-sm text-gray-300'>
      {hours}h {mins}m {secs}s
    </div>
  )
}