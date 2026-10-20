import { useState } from 'react'
import type { DigitsQ, NumberQ } from '../data/types'
import { normalizeNumber } from '../lib/answer'
import { DECIMAL_KEYS, typeKey } from '../lib/keys'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔']

export function NumberInput({ q, onAnswer, locked }: GameProps<NumberQ>) {
  const [value, setValue] = useState('')
  const keys = q.decimal ? DECIMAL_KEYS : KEYS

  const press = (k: string) => {
    if (locked) return
    sfx.tap()
    if (k === '✔') {
      if (!value) return
      if (q.decimal) {
        onAnswer(q.answers.some((a) => Number(a) === Number(value)))
        return
      }
      const v = normalizeNumber(value)
      onAnswer(q.answers.some((a) => normalizeNumber(a) === v))
    } else setValue((v) => typeKey(v, k))
  }

  return (
    <div className="keypad-wrap">
      {q.paper && <div className="paper-badge">✏️ 先在紙上算，再把答案填進來</div>}
      <div className="display">
        <span className="digits">{value ? (q.decimal || q.plain ? value : Number(value).toLocaleString('en-US')) : '　'}</span>
        {q.unit && <span className="unit">{q.unit}</span>}
      </div>
      <div className="keypad">
        {keys.map((k) => (
          <button
            key={k}
            className={`key ${k === '✔' ? 'enter' : ''} ${k === '✔' && q.decimal ? 'wide' : ''}`}
            disabled={locked || (k === '✔' && !value)}
            onClick={() => press(k)}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Digits({ q, onAnswer, locked }: GameProps<DigitsQ>) {
  const [picked, setPicked] = useState<number[]>([])
  const toggle = (d: number) => {
    sfx.tap()
    setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))
  }
  const submit = () => {
    const ok = picked.length === q.answer.length && q.answer.every((d) => picked.includes(d))
    onAnswer(ok)
  }
  return (
    <div className="keypad-wrap">
      <div className="digit-grid">
        {Array.from({ length: 10 }, (_, d) => (
          <button
            key={d}
            className={`key ${picked.includes(d) ? 'picked' : ''}`}
            disabled={locked}
            onClick={() => toggle(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <button className="big-btn primary" disabled={locked || picked.length === 0} onClick={submit}>
        選好了
      </button>
    </div>
  )
}
