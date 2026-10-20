import { useState } from 'react'
import type { SortQ } from '../data/types'
import { sortAnswer } from '../lib/answer'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'
import { Rich } from './Rich'

/** 排排看：依序點出由大到小（或由小到大、事情的先後）；點錯會抖一下，自己改到排完（自己訂正） */
export function Sort({ q, onAnswer, locked }: GameProps<SortQ>) {
  const order = sortAnswer(q)
  const [done, setDone] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<number | null>(null)

  const pick = (i: number) => {
    if (locked || done.includes(i)) return
    if (order[done.length] !== i) {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShake(i)
      setTimeout(() => setShake(null), 400)
      return
    }
    sfx.tap()
    const next = [...done, i]
    setDone(next)
    if (next.length === q.items.length) setTimeout(() => onAnswer(mistakes === 0, { selfCorrected: true }), 400)
  }

  const sign = q.order === 'desc' ? '＞' : q.order === 'asc' ? '＜' : '→'
  return (
    <div className="picture-game">
      <div className="sort-slots">
        {q.items.map((_, k) => (
          <span key={k} className="sort-slot-wrap">
            <span className={`sort-slot ${done[k] !== undefined ? 'filled' : ''}`}>
              {done[k] !== undefined ? <Rich text={q.items[done[k]]} /> : '　'}
            </span>
            {k < q.items.length - 1 && <span className="sort-sign">{sign}</span>}
          </span>
        ))}
      </div>
      <div className="row-buttons wrap">
        {q.items.map((s, i) => (
          <button
            key={i}
            className={`big-btn ${shake === i ? 'shake' : ''}`}
            disabled={locked || done.includes(i)}
            onClick={() => pick(i)}
          >
            <Rich text={s} />
          </button>
        ))}
      </div>
      <p className="counter">{q.order === 'desc' ? '從最大的開始點' : q.order === 'asc' ? '從最小的開始點' : '從最先發生的開始點'}</p>
    </div>
  )
}
