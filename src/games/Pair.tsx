import { useState } from 'react'
import type { PairQ } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔']

/** 兩格數字：點格子切換要填哪一格，兩格都填好才能送出 */
export function Pair({ q, onAnswer, locked }: GameProps<PairQ>) {
  const [values, setValues] = useState<[string, string]>(['', ''])
  const [slot, setSlot] = useState<0 | 1>(0)
  const ready = values[0] !== '' && values[1] !== ''

  const press = (k: string) => {
    if (locked) return
    sfx.tap()
    if (k === '✔') {
      if (ready) onAnswer(Number(values[0]) === q.answers[0] && Number(values[1]) === q.answers[1])
      return
    }
    setValues((v) => {
      const next: [string, string] = [...v]
      next[slot] = k === '⌫' ? v[slot].slice(0, -1) : v[slot].length < 8 ? v[slot] + k : v[slot]
      return next
    })
  }

  const box = (i: 0 | 1) => (
    <button className={`div-slot ${slot === i ? 'active' : ''}`} disabled={locked} onClick={() => setSlot(i)}>
      <span className="div-value">{values[i] ? Number(values[i]).toLocaleString('en-US') : '　'}</span>
      <span className="div-label">{q.labels[i]}</span>
    </button>
  )

  return (
    <div className="keypad-wrap">
      {q.paper && <div className="paper-badge">✏️ 先在紙上算，再把答案填進來</div>}
      <div className="div-equation">
        {box(0)}
        {q.joiner && <span className="div-sep">{q.joiner}</span>}
        {box(1)}
      </div>
      <p className="counter">點一下格子，再按數字；兩格都填好就按 ✔</p>
      <div className="keypad">
        {KEYS.map((k) => (
          <button
            key={k}
            className={`key ${k === '✔' ? 'enter' : ''}`}
            disabled={locked || (k === '✔' && !ready)}
            onClick={() => press(k)}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
