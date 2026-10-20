import { useState } from 'react'
import type { EquationQ } from '../data/types'
import { equationResult } from '../lib/answer'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'
import { Pile } from './Picture'
import type { GameProps } from './types'

type Slot = 'a' | 'b' | 'c'

/**
 * 一年級算式：從左到右依序填空格，點錯會抖一下，自己改到填完（自己訂正）。
 * 加法的 a、b 都要填時，先填哪一個都可以（7＋3 和 3＋7 都對）；減法的圖是同一堆畫掉幾個。
 */
export function Equation({ q, onAnswer, locked }: GameProps<EquationQ>) {
  const order = (['a', 'b', 'c'] as Slot[]).filter((s) => q.blanks.includes(s))
  const [filled, setFilled] = useState<Partial<Record<Slot, number>>>({})
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState(false)
  const current = order.find((s) => filled[s] === undefined)
  const values: Record<Slot, number> = { a: q.a, b: q.b, c: equationResult(q) }

  /** 這一格可以接受的數字 */
  const accepts = (slot: Slot, n: number) => {
    if (q.op === '+' && q.blanks.includes('a') && q.blanks.includes('b')) {
      if (slot === 'a') return n === q.a || n === q.b
      if (slot === 'b') return n === (filled.a === q.a ? q.b : q.a)
    }
    return n === values[slot]
  }

  const press = (n: number) => {
    if (locked || !current) return
    if (!accepts(current, n)) {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }
    sfx.tap()
    speak(String(n))
    const next = { ...filled, [current]: n }
    setFilled(next)
    if (order.every((s) => next[s] !== undefined)) setTimeout(() => onAnswer(mistakes === 0, { selfCorrected: true }), 400)
  }

  const cell = (slot: Slot) => {
    const isBlank = q.blanks.includes(slot)
    const shown = isBlank ? filled[slot] : values[slot]
    const active = slot === current
    return (
      <span className={`eq-cell ${isBlank ? (shown === undefined ? 'blank' : 'filled') : ''} ${active ? 'active' : ''} ${active && shake ? 'shake' : ''}`}>
        {shown ?? '？'}
      </span>
    )
  }

  return (
    <div className="picture-game">
      {q.emoji && (
        <div className="bond-piles">
          {/* 減法：同一堆畫掉 b 個 */}
          <Pile emoji={q.emoji} n={q.a} crossed={q.op === '-' ? q.b : 0} />
          {q.op === '+' && (
            <>
              <div className="bond-divider" aria-hidden />
              <Pile emoji={q.emoji} n={q.b} />
            </>
          )}
        </div>
      )}
      <div className="eq-row">
        {cell('a')}
        <span className="eq-op">{q.op === '+' ? '＋' : '－'}</span>
        {cell('b')}
        <span className="eq-op">＝</span>
        {cell('c')}
      </div>
      <div className="number-row">
        {Array.from({ length: 11 }, (_, n) => (
          <button key={n} className="key round" disabled={locked || !current} onClick={() => press(n)}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
