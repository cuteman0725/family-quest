import { useState } from 'react'
import type { SequenceQ } from '../data/types'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'
import type { GameProps } from './types'

/** 數字接龍：由左到右一格一格填空；填錯會抖一下，自己改到全部填好（跟連連看一樣自己訂正） */
export function Sequence({ q, onAnswer, locked }: GameProps<SequenceQ>) {
  const [filled, setFilled] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState(false)
  const current = q.blanks[filled]
  const max = Math.max(10, ...q.values)

  const press = (n: number) => {
    if (locked || current === undefined) return
    if (n !== q.values[current]) {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    sfx.tap()
    speak(String(n))
    const next = filled + 1
    setFilled(next)
    if (next === q.blanks.length) setTimeout(() => onAnswer(mistakes === 0, { selfCorrected: true }), 400)
  }

  return (
    <div className="picture-game">
      <div className="seq-row">
        {q.values.map((v, i) => {
          const blankIndex = q.blanks.indexOf(i)
          const isBlank = blankIndex >= 0 && blankIndex >= filled
          const active = i === current
          return (
            <span key={i} className={`seq-cell ${isBlank ? 'blank' : ''} ${active ? 'active' : ''} ${active && shake ? 'shake' : ''}`}>
              {isBlank ? '？' : v}
            </span>
          )
        })}
      </div>
      <div className="number-row">
        {Array.from({ length: max + 1 }, (_, n) => (
          <button key={n} className="key round" disabled={locked || current === undefined} onClick={() => press(n)}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
