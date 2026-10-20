import { useState } from 'react'
import type { DivideQ } from '../data/types'
import { divideAnswer } from '../lib/answer'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔']

/** 直式除法：先在紙上算，再把「商」和「餘數」填進兩格（點格子切換要填哪一格） */
export function Divide({ q, onAnswer, locked }: GameProps<DivideQ>) {
  const [values, setValues] = useState<[string, string]>(['', ''])
  const [slot, setSlot] = useState<0 | 1>(0)
  const labels = q.units ?? ['商', '餘數']

  const press = (k: string) => {
    if (locked) return
    sfx.tap()
    if (k === '✔') {
      if (!values[0] || !values[1]) return
      const { quotient, remainder } = divideAnswer(q)
      onAnswer(Number(values[0]) === quotient && Number(values[1]) === remainder)
      return
    }
    // 不自動跳到第二格：商的位數不固定，自動跳格反而容易填錯位置
    setValues((v) => {
      const next: [string, string] = [...v]
      next[slot] = k === '⌫' ? v[slot].slice(0, -1) : v[slot].length < 6 ? v[slot] + k : v[slot]
      return next
    })
  }

  const box = (i: 0 | 1) => (
    <button className={`div-slot ${slot === i ? 'active' : ''}`} disabled={locked} onClick={() => setSlot(i)}>
      <span className="div-value">{values[i] || '　'}</span>
      <span className="div-label">{labels[i]}</span>
    </button>
  )

  return (
    <div className="keypad-wrap">
      <div className="paper-badge">✏️ 先在紙上用直式算、再用乘法驗算，然後填答案</div>
      <div className="div-equation">
        {!q.units && (
          <span className="div-expr">
            {q.dividend} ÷ {q.divisor} ＝
          </span>
        )}
        {box(0)}
        <span className="div-sep">{q.units ? '，剩下' : '…'}</span>
        {box(1)}
      </div>
      <p className="counter">點一下格子，再按數字；兩格都填好就按 ✔</p>
      <div className="keypad">
        {KEYS.map((k) => (
          <button
            key={k}
            className={`key ${k === '✔' ? 'enter' : ''}`}
            disabled={locked || (k === '✔' && (!values[0] || !values[1]))}
            onClick={() => press(k)}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
