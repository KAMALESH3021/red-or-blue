import React from 'react'
import { useState } from 'react'
import api from '../api'

export default function CreateGameModal({
  close,
  refresh
}) {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(10)

  const [form, setForm] = useState({
    question: '',
    blueLabel: 'Blue',
    redLabel: 'Red',
    duration: 600,
    tieRule: 'draw',
    messages: {
      blueWin: '',
      blueLose: '',
      redWin: '',
      redLose: ''
    }
  })

  const handleSubmit = async e => {
    e.preventDefault()

    if (
      !form.question.trim() ||
      !form.blueLabel.trim() ||
      !form.redLabel.trim() ||
      !form.messages.blueWin.trim() ||
      !form.messages.blueLose.trim() ||
      !form.messages.redWin.trim() ||
      !form.messages.redLose.trim()
    ) {
      alert('Please fill all required fields')
      return
    }

    const duration =
      days * 86400 +
      hours * 3600 +
      minutes * 60

    if (duration < 600 || duration > 172800) {
      alert(
        'Duration must be between 10 minutes and 2 days'
      )
      return
    }

    await api.post('/games', {
      ...form,
      duration
    })

    refresh()
    close()
  }

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-pink-220 p-5 rounded-2xl w-full max-w-lg flex flex-col gap-4 max-h-[90vh] overflow-y-scroll'
      >
        <h2 className='text-2xl font-bold'>
          Create Game
        </h2>

        <input
          required
          placeholder='Question'
          className='p-3 rounded-xl text-black min-h-[60px]'
          onChange={e =>
            setForm({
              ...form,
              question: e.target.value
            })
          }
        />

        <input
          required
          placeholder='Blue Label'
          className='p-3 rounded-xl text-black min-h-[60px]'
          onChange={e =>
            setForm({
              ...form,
              blueLabel: e.target.value
            })
          }
        />

        <input
          required
          placeholder='Red Label'
          className='p-3 rounded-xl text-black min-h-[60px]'
          onChange={e =>
            setForm({
              ...form,
              redLabel: e.target.value
            })
          }
        />

        <div className='grid grid-cols-3 gap-3'>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-bold'>
              Days
            </label>

            <input
              type='number'
              min='0'
              max='2'
              value={days}
              className='p-3 rounded-xl text-black'
              onChange={e =>
                setDays(Number(e.target.value))
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-bold'>
              Hours
            </label>

            <input
              type='number'
              min='0'
              max='23'
              value={hours}
              className='p-3 rounded-xl text-black'
              onChange={e =>
                setHours(Number(e.target.value))
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-bold'>
              Minutes
            </label>

            <input
              type='number'
              min='0'
              max='59'
              value={minutes}
              className='p-3 rounded-xl text-black'
              onChange={e =>
                setMinutes(Number(e.target.value))
              }
            />
          </div>

        </div>

        <select
          className='p-3 rounded-xl text-black min-h-[60px]'
          onChange={e =>
            setForm({
              ...form,
              tieRule: e.target.value
            })
          }
        >
          <option value='blueWins'>
            Blue wins tie
          </option>

          <option value='redWins'>
            Red wins tie
          </option>

          <option value='draw'>
            Draw
          </option>
        </select>

        <textarea
          required
          placeholder='Blue Win Message'
          className='p-3 rounded-xl text-black min-h-[60px] resize-none'
          onChange={e =>
            setForm({
              ...form,
              messages: {
                ...form.messages,
                blueWin: e.target.value
              }
            })
          }
        />

        <textarea
          required
          placeholder='Blue Lose Message'
          className='p-3 rounded-xl text-black min-h-[60px] resize-none'
          onChange={e =>
            setForm({
              ...form,
              messages: {
                ...form.messages,
                blueLose: e.target.value
              }
            })
          }
        />

        <textarea
          required
          placeholder='Red Win Message'
          className='p-3 rounded-xl text-black min-h-[60px] resize-none'
          onChange={e =>
            setForm({
              ...form,
              messages: {
                ...form.messages,
                redWin: e.target.value
              }
            })
          }
        />

        <textarea
          required
          placeholder='Red Lose Message'
          className='p-3 rounded-xl text-black min-h-[60px] resize-none'
          onChange={e =>
            setForm({
              ...form,
              messages: {
                ...form.messages,
                redLose: e.target.value
              }
            })
          }
        />

        <button className='bg-blue-400 py-3 rounded-xl font-bold'>
          Create
        </button>

        <button
          type='button'
          onClick={close}
          className='bg-red-600 py-3 rounded-xl font-bold'
        >
          Cancel
        </button>
      </form>
    </div>
  )
}