import { useState } from 'react'
import type { FracLineQ, FractionQ } from '../data/types'
import { fractionAnswerOk } from '../lib/answer'
import { mixedText } from '../lib/fraction'
import { sfx } from '../lib/sfx'
import { typeKey } from '../lib/keys'
import { Rich } from './Rich'
import type { GameProps } from './types'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔']

/** 分數填答：分母已經寫好，點「整數」或「分子」格子再按數字 */
export function FractionInput({ q, onAnswer, locked }: GameProps<FractionQ>) {
  const slots = q.improper ? (['num'] as const) : (['whole', 'num'] as const)
  const [values, setValues] = useState({ whole: '', num: '' })
  const [slot, setSlot] = useState<'whole' | 'num'>(slots[0])
  // 答案是整數時分子可以空著
  const ready = q.improper ? values.num !== '' : values.whole !== '' || values.num !== ''

  const press = (k: string) => {
    if (locked) return
    sfx.tap()
    if (k === '✔') {
      if (ready) onAnswer(fractionAnswerOk(q, Number(values.whole || 0), Number(values.num || 0)))
      return
    }
    setValues((v) => ({ ...v, [slot]: typeKey(v[slot], k, 4) }))
  }

  const box = (s: 'whole' | 'num', label: string) => (
    <button className={`frac-slot ${slot === s ? 'active' : ''}`} disabled={locked} onClick={() => setSlot(s)} aria-label={label}>
      {values[s] || '　'}
    </button>
  )

  return (
    <div className="keypad-wrap">
      {q.paper && <div className="paper-badge">✏️ 先在紙上算，再把答案填進來</div>}
      <div className="frac-input">
        {!q.improper && box('whole', '整數')}
        <span className="frac">
          {box('num', '分子')}
          <span className="frac-den fixed">{q.den}</span>
        </span>
        {q.unit && <span className="unit">{q.unit}</span>}
      </div>
      <p className="counter">
        {q.improper ? '分母已經寫好了，填分子就好' : '左邊填整數、上面填分子；答案是整數時，分子空著就好'}
      </p>
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

/** 分數數線：點一個刻度，再按「就是這裡」 */
export function FracLine({ q, onAnswer, locked }: GameProps<FracLineQ>) {
  const [picked, setPicked] = useState<number | null>(null)
  const ticks = q.den * q.max
  const W = 680
  const pad = 30
  const x = (i: number) => pad + (i / ticks) * (W - pad * 2)

  return (
    <div className="picture-game">
      <svg className="frac-line" viewBox={`0 0 ${W} 130`} role="group" aria-label="數線">
        <line x1={x(0)} y1={60} x2={x(ticks)} y2={60} className="fl-axis" />
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const whole = i % q.den === 0
          return (
            <g key={i}>
              <line x1={x(i)} y1={whole ? 42 : 50} x2={x(i)} y2={whole ? 78 : 70} className={whole ? 'fl-tick whole' : 'fl-tick'} />
              {whole && (
                <text x={x(i)} y={110} className="fl-label">
                  {i / q.den}
                </text>
              )}
              {/* 大一點的點擊範圍 */}
              <rect
                x={x(i) - (W - pad * 2) / ticks / 2}
                y={20}
                width={(W - pad * 2) / ticks}
                height={70}
                className="fl-hit"
                onClick={() => {
                  if (locked) return
                  sfx.tap()
                  setPicked(i)
                }}
              />
            </g>
          )
        })}
        {picked !== null && (
          <g className="fl-marker">
            <circle cx={x(picked)} cy={60} r={11} />
            <text x={x(picked)} y={26} className="fl-picked">
              {picked % q.den === 0 ? picked / q.den : `${picked}/${q.den}`}
            </text>
          </g>
        )}
      </svg>
      <p className="counter">
        每一大格是 1，分成 {q.den} 小格，一小格是 <Rich text={`1/${q.den}`} />
        {picked !== null && picked % q.den !== 0 && picked > q.den && (
          <>
            ；你點的是 <Rich text={`${picked}/${q.den}`} />，也就是 <Rich text={mixedText(picked, q.den)} />
          </>
        )}
      </p>
      <button className="big-btn primary" disabled={locked || picked === null} onClick={() => onAnswer(picked === q.target)}>
        就是這裡 ✔
      </button>
    </div>
  )
}
